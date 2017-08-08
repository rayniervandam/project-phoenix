import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator-setup',
  templateUrl: './simulator-setup.component.html',
  styleUrls: ['./simulator-setup.component.css']
})
export class SimulatorSetupComponent implements OnInit {

  // The models for the input and output of our data
  public attributeInput = "";
  public attributeOutput = [];

  // Data we gather during validation of data
  public attributeParseReport = new DataParseReport();

  public productInput = "";
  public productOutput = [];

  // Data we gather during validation of data
  public productParseReport = new DataParseReport();

  // Keep track of our selected 'tab'
  public inputPage = "attributes";

  constructor() { }

  ngOnInit() { }

  processAttributeInput(event): void {
    this.attributeOutput = this.parseAttributeInput(this.attributeInput);
    this.attributeParseReport = this.validateAttributeData(this.attributeOutput);
  }

  validateAttributeData(attributeData): DataParseReport  {
    // Prepare our validation report
    var attributeParseReport = new DataParseReport();

    attributeParseReport.dataCount = attributeData.length;

    // If at least 1 attribute has been parsed, data is valid to be submitted
    if(attributeParseReport.dataCount > 0) {
      attributeParseReport.dataValid = true;
    } else {
      attributeParseReport.dataValid = false;
    }

    // If data is valid but only 1 attribute is present, give a warning
    attributeParseReport.dataWarning = attributeParseReport.dataValid && attributeParseReport.dataCount < 2;

    return attributeParseReport;
  }

  parseAttributeInput(attributeInput): Array<Object> {
      var columnDelimiter = this.detectDelimiter(attributeInput);

      // Split all lines
      var attributeLines = attributeInput.split('\n');

      // First line should be attribute type indicators
      var attributeTypes = attributeLines[0].split(columnDelimiter);

      // Second line should be attribute names
      var attributeNames = attributeLines[1].split(columnDelimiter);

      // Create our list to container our attribute objects
      var attributeList = [];

      // Initialise our attribute objects with name and type
      for(let a = 0; a < attributeNames.length; a++) {
        var attribute = {name: "", type: "", levels: []};
        attribute.name = attributeNames[a];

        if(attributeTypes[a].toUpperCase() == "S") {
            attribute.type = "Slope"
        } else if(attributeTypes[a].toUpperCase() == "I") {
            attribute.type = "Interpolation"
        } else if(attributeTypes[a].toUpperCase() == "PF") {
            attribute.type = "Product Filter"
        } else if(attributeTypes[a].toUpperCase() == "RF") {
            attribute.type = "Respondent Filter"
        } else {
            attribute.type = "Category";
        }

        attributeList.push(attribute);
      }

      // Loop over remaining input lines and store levels in attribute objects
      for(let x = 2; x < attributeLines.length; x++) {
        var levelValues = attributeLines[x].split(columnDelimiter);

        for(let y = 0; y < levelValues.length; y++) {
          if(levelValues[y] != "") {
            attributeList[y].levels.push(levelValues[y]);
          }
        }
      }

      return attributeList;
  }

  processProductInput(event): void {
    this.productOutput = this.parseProductInput(this.productInput,this.attributeOutput);
    this.productParseReport = this.validateProductData(this.productOutput);
  }

  validateProductData(productData): DataParseReport {
    // Prepare our validation report
    var productParseReport = new DataParseReport();

    productParseReport.dataCount = productData.length;

    // If at least 1 product has been parsed, data is valid to be submitted
    if(productParseReport.dataCount > 0) {
      productParseReport.dataValid = true;
    } else {
      productParseReport.dataValid = false;
    }

    // If data is valid but only 1 product is present, give a warning
    productParseReport.dataWarning = productParseReport.dataValid && productParseReport.dataCount < 10;

    return productParseReport;
  }

  parseProductInput(productInput,attributeData): Array<Object> {
      var columnDelimiter = this.detectDelimiter(productInput);

      // Split all lines
      var productLines = productInput.split('\n');

      var productList = [];

      // Loop over remaining input lines and store levels in attribute objects
      for(let x = 1; x < productLines.length; x++) {
        var productValues = productLines[x].split(columnDelimiter);
        var productObject = {
          order: productValues[0],
          name: productValues[1],
          active: productValues[2],
          distribution: productValues[3],
          attributeData: [],
          filterData: []
        };

        for(let y = 4; y < productValues.length; y++) {
          if(attributeData[y-4].type == 'Product Filter') {
            productObject.filterData.push(productValues[y]);
          } else if (attributeData[y-4].type == 'Category' ||
                     attributeData[y-4].type == 'Interpolation' ||
                     attributeData[y-4].type == 'Slope') {
            productObject.attributeData.push(productValues[y]);
          }
        }

        productList.push(productObject);
      }

      return productList;
  }

  detectDelimiter(data): String {
    var dataDelimiter;

    // Detect used delimiter (either tab or comma)
    if(data.split("	").length > 1) {
      dataDelimiter = "	"; // tab
    } else {
      dataDelimiter = ",";
    }

    return dataDelimiter;
  }
}

class DataParseReport {
  dataValid: Boolean = false;
  dataWarning: Boolean = false;
  dataCount: Number = 0;
}
