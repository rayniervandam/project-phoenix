import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator-setup',
  templateUrl: './simulator-setup.component.html',
  styleUrls: ['./simulator-setup.component.css']
})
export class SimulatorSetupComponent implements OnInit {

  public attributeInput = "";
  public attributeOutput = [];

  public attributeDataValid = false;
  public attributeDataWarning = false;
  public attributeCount = 0;

  public inputPage = "attributes";

  constructor() { }

  ngOnInit() {
  }

  validateAttributeData() {
    this.attributeCount = this.attributeOutput.length;

    // If at least 1 attribute has been parsed, data is valid to be submitted
    if(this.attributeCount > 0) {
      this.attributeDataValid = true;


    } else {
      this.attributeDataValid = false;
    }

    // If data is valid but only 1 attribute is present, give a warning
    this.attributeDataWarning = this.attributeDataValid && this.attributeCount < 2;
  }

  processAttributeInput(event) {
      this.attributeDataValid = false;
      this.attributeDataWarning = false;

      var columnDelimiter;

      // Detect used delimiter (either tab or comma)
      if(this.attributeInput.split("	").length > 1) {
        columnDelimiter = "	"; // tab
      } else {
        columnDelimiter = ",";
      }

      // Split all lines
      var attributeLines = this.attributeInput.split('\n');

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

      this.attributeOutput = attributeList;

      this.validateAttributeData();
  }


}
