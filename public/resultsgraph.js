function getParams() {
  var url = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  var result = {};
  url.forEach(function(item) {
    var param = item.split("=");
    result[param[0]] = param[1];
  });
  return result;
}

function SurveyManager(baseUrl, accessKey) {
  var self = this;
  self.surveyId = decodeURI(getParams()["id"]);
  self.results = ko.observableArray();
  Survey.dxSurveyService.serviceUrl = "";
  var survey = new Survey.Model({
    surveyId: self.surveyId,
    surveyPostId: self.surveyId
  });
  self.columns = ko.observableArray();

  self.loadResults = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl + "/results?postId=" + self.surveyId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      var result = xhr.response ? JSON.parse(xhr.response) : [];
      var counts = {};
      result.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
      console.log(counts);
      var ArrayData=[];
      for(var key in counts){
        if(counts.hasOwnProperty(key))
        {
        var JsonData={};
        var JsonItem=JSON.parse(key);
        for(var It in JsonItem)
        {
          JsonData['x']=JsonItem[It];
        }
        JsonData['value']=counts[key];
        ArrayData.push(JsonData);

        }


       }
    console.log(ArrayData);
    var chart = anychart.column3d(ArrayData);
          //chart.title("Create a 3D Column chart");

      chart.container("container");

      chart.draw();
    };
    xhr.send();
  };

  survey.onLoadSurveyFromService = function() {
    self.loadResults();
  };
}

ko.applyBindings(new SurveyManager(""), document.body);
