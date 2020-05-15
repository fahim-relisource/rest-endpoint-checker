function loadApp() {
  return {
    config: {
      name: 'Fake JSON',
      version: '1.0',
      endpoints: [
        {
          name: 'List User',
          url: 'https://reqres.in/api/users?page=1',
          method: 'GET',
          headers: [],
          requestBody: []
        },
        {
          name: 'Single User',
          url: 'https://reqres.in/api/users/2',
          method: 'GET',
          headers: [],
          requestBody: []
        },
        {
          name: 'Create User',
          url: 'https://reqres.in/api/users',
          method: 'POST',
          headers: [],
          requestBody: [
            {
              name: 'name',
              type: 'text'
            },
            {
              name: 'Job',
              type: 'text'
            }
          ]
        }
      ]
    },
    output: null,
    requestUrl: "Please Select an Endpoint",
    headers: {},
    requestData: {},
    selectedFunction: null,
    showLoader: false,
    selectThisFunction(index) {
      let currentFunction = this.config.endpoints[index];

      this.requestUrl = currentFunction.url;

      this.headers = currentFunction.headers.reduce((acc, curr) => {
        acc[`${curr}`] = "";
        return acc;
      }, {});

      this.requestData = currentFunction.requestBody.reduce((acc, curr) => {
        acc[`${curr.name}`] = "";
        return acc;
      }, {});
      this.selectedFunction = currentFunction;
    },
    sendRequest() {
      this.output = null;
      this.showLoader = true;
      fetch(this.requestUrl, {
        headers: this.headers,
        method: this.selectedFunction.method,
        body:
          this.selectedFunction.method === "POST"
            ? JSON.stringify(this.requestData)
            : null,
      })
        .then((response) => {
          this.showLoader = false;
          this.output = {
            error: !response.ok,
            code: response.status,
          };
          response.json().then((data) => {
            this.output = {
              ...this.output,
              data: JSON.stringify(data, undefined, 2),
            };
          });
        })
        .catch((error) => {
          console.log("Error", error);
        });
    },
    arrayToObj(arr) {
      return arr.reduce(function (acc, curr) {
        acc[`${curr.name}`] = "";
        return acc;
      }, {});
    },
    loadConfig(e) {
      const fileList = event.target.files;
      const file = fileList[0];
      if (file.type && file.type.indexOf("json") === -1) {
        console.log("File is not an image.", file.type, file);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        this.config = JSON.parse(reader.result);
      });
      reader.readAsText(file);
    },
  };
}
