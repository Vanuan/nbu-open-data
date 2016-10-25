window.getMonetary = function getMonetary(period) {

  return fetch("http://edr.data-gov-ua.org:8080/https://bank.gov.ua/NBUStatService/v1/statdirectory/monetary%3Fdate%3D" + period + "%26json")
    .then(function(res) { return res.json() })
    .then(function(data) {

    data = data.map(function(d) {
      d.k076txt = d.k076txt.replace(/i/g, "i");
      d.k076txt = d.k076txt.replace(/o/g, "о");
      return d;
    });

    var seen = [];
    var flat = [];
    data.forEach(function (element) {
      if (seen.indexOf(element.id_api) === -1) {
        flat.push({
          "text": element.txt,
          "id": element.id_api,
          "parentId": element.parent
        });
        seen.push(element.id_api)
      }
    });
    flat.push({ "text": "Грошові агрегати", "id": "Monetary" })
    var children = getLeafs(data);
    children.forEach(function(child) {
      Object.keys(child.components).forEach(function(key) {
        flat.push({
          "text": key,
          "id": child.id_api+key,
          "parentId": child.id_api,
          "value": child.components[key]
        });
      })
    });
    return flat;

    function getLeafs(data) {
      var elements = data;
      var dict = {};
      function getId(element) {
        return element.level + element.id_api ;
      }
      function getParentId(element) {
        return (element.level - 1) + element.parent ;
      }
      function getNode(id) {
        var el = dict[id];
        if(!el) {
          el = dict[id] = {};
        }
        return el;
      }

      elements.forEach(function(element) {
        var id = getId(element)
        var node = getNode(id)
        //delete element.k076txt;
        delete element.dt;
        ["freq", "txt", "level", "tzepname", "id_api", "parent"].forEach(function(key) {
          node[key] = element[key]
        });

        if (!node.components) {
          node.components = {};
        }
        node.components[element.k076txt] = element.value;
        var parent = getNode(getParentId(element))
        var children = parent.children;
        if (!children) {
          children = parent.children = [];
        }
        children.push(node);
      });
      var leafKeys = Object.keys(dict).filter(function(key) {
        return !dict[key].hasOwnProperty("children");
      });
      var objects = leafKeys.map(function(key) {
        if(Object.keys(dict[key].components).length > 1) {
          delete dict[key].components["Усього"];
        } else {
          dict[key].components["Готівка (M0)"] = dict[key].components["Усього"];
          delete dict[key].components["Усього"];
        }
        return dict[key];
      });
      return objects;
    }

  });

}
