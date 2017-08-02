// The simulator object with all properties
var simulator = {};

// All respondents with utility data
var respondents = [];

// Attribute data
var attributes = {};

// All product configurations in current scenario
var products = [];

// Currently selected filters
var selectedFilter = [];

// Currently stored shares
var shares = [];

// Amount of respondents filtered out
var filteredRespondents = 0;

// Weights
var weights = {};

// Stored product utilities from last calculation
var respondentUtilities = [];

// Stored shares per respondent from last calculation
var respondentShares = [];

// Debugging info
var debuggingInfo = {};

this.onmessage = function(e) {
  if (e.data[0] === 'init') {
    // Initialise data
    simulator = e.data[1];
    respondents = e.data[2];
    attributes = e.data[3];
    products = e.data[4];
    selectedFilter = e.data[5];
    weights = e.data[6];

    // Sort respondents
    // TODO: We sort the respondents now, because the weights need them to be in order. However this is not efficient.
    respondents.sort(function(a, b) { return a.respondentNumber - b.respondentNumber; });

    if (simulator.debugging) {

      console.info('Debugging is on.');
      console.info('----------');
      console.info('Weights');
      console.info('Product Weights');
      console.info(weights.productWeights);
      console.info('Respondent Weights');
      console.info(weights.respondentWeights);
      console.info('----------');
      console.info('Respondents');
      console.info(respondents);
      console.info('----------');
      console.info('Products');
      console.info(products);
      console.info('----------');

      debuggingInfo.calculationMethod = [];
      debuggingInfo.summedUsedUtilities = [];
      debuggingInfo.productSharePerRespondent = [];
      debuggingInfo.exponents = [];

    }

    // Create an empty 2d array for stored utilities
    for (var x = 0; x < respondents.length; x++) {
      respondentUtilities[x] = [];

      for (var y = 0; y < products.length; y++) {
        respondentUtilities[x][y] = 0;

      }
    }


    // Calculate shares based on current data
    shares = calculateSharesForProducts([]);

    if (simulator.debugging) {

      console.info('Respondent Utilities');
      console.info(respondentUtilities);
      console.info('----------');
      console.info('Calculation Method used');
      console.info(debuggingInfo.calculationMethod);
      console.info('----------');
      console.info('Exponents');
      console.info(debuggingInfo.exponents);
      console.info('----------');
      console.info('Summmed Used Exponents');
      console.info(debuggingInfo.summedUsedUtilities);
      console.info('----------');
      console.info('Used Product Share per Respondent');
      console.info(debuggingInfo.productSharePerRespondent);
      console.info('----------');
      console.info('Shares');
      console.info(shares);

    }

    console.log('respondent shares', respondentShares);

    // Return the result
    postMessage({ type: 'result', message: shares, respondentCount: respondents.length - filteredRespondents, respondentUtilities: respondentUtilities, respondentShares: respondentShares });

  } else if (e.data[0] === 'calcProducts') {
    // Update products before new calculation
    products = e.data[1];
    selectedFilter = e.data[2];
    weights = e.data[3];
    simulator = e.data[4];

    if (simulator.debugging) {

      console.info('Debugging is on.');
      console.info('----------');
      console.info('Weights');
      console.info('Product Weights');
      console.info(weights.productWeights);
      console.info('Respondent Weights');
      console.info(weights.respondentWeights);
      console.info('----------');
      console.info('Products');
      console.info(products);
      console.info('----------');

      debuggingInfo.calculationMethod = [];
      debuggingInfo.summedUsedUtilities = [];
      debuggingInfo.productSharePerRespondent = [];
      debuggingInfo.exponents = [];

    }

    // Calculate shares based on current data
    shares = calculateSharesForProducts(e.data[5]);

    if (simulator.debugging) {

      console.info('Calculation Method used');
      console.info(debuggingInfo.calculationMethod);
      console.info('----------');
      console.info('Exponents');
      console.info(debuggingInfo.exponents);
      console.info('----------');
      console.info('Summmed Used Exponents');
      console.info(debuggingInfo.summedUsedUtilities);
      console.info('----------');
      console.info('Used Product Share per Respondent');
      console.info(debuggingInfo.productSharePerRespondent);
      console.info('----------');
      console.info('Shares');
      console.info(shares);

    }

    console.log('respondent shares', respondentShares);

    // Return the result
    postMessage({ type: 'result', message: shares, respondentCount: respondents.length - filteredRespondents });
  }


};

function checkThreshold(a) {
  return a.exponent >= this.threshold;
}

function calculateSharesForProducts(changedProducts) {
  // Set our calculation method
  var calculationMethod = simulator.activeCalculation;

  var noneEnabled = simulator.noneEnabled;

  // The array which will store our newly calculated shares
  var tempShares = [];

  // Reset our shares array and prep for counting
  // We use <= to also prep 1 extra array slot we can store the none value in
  for (var p = 0; p <= products.length; p++) {
    tempShares[p] = 0;
  }

  // We keep track of how many respondents we have filtered out
  filteredRespondents = 0;

  // Loop through all respondents, calculating the product utilities for that respondent for each product and
  // determine the best product (for 1st choice) or all product exponents (for share of preference)
  for (var x = 0; x < respondents.length; x++) {

    // The array of product exponents (share of preference)
    var exponents = [];

    var filteredRespondent = false;

    if (selectedFilter.length !== 0) {

      var conditionMetFlag = false;

      for (var t = 0; t < respondents[x].filterData.length; t++) {
        if (respondents[x].filterData[t] === selectedFilter[t]) {
          conditionMetFlag = true;
        } else if (respondents[x].filterData[t] !== selectedFilter[t] && parseInt(selectedFilter[t], 10) !== 0) {
          conditionMetFlag = false;
          break;
        } else if (parseInt(selectedFilter[t], 10) === 0) {
          conditionMetFlag = true;
        }
      }

      if (!conditionMetFlag) {
        filteredRespondents++;
        filteredRespondent = true;
      }

    }

    if (filteredRespondent) {
      continue;
    }

    if (simulator.debugging) {

      if (calculationMethod === 'respspec') {

        debuggingInfo.calculationMethod.push(respondents[x].calculationMethod);

      } else {

        debuggingInfo.calculationMethod.push(calculationMethod);

      }

    }

    // Now loop through all products for this respondent
    for (var a = 0; a < products.length; a++) {

      if (changedProducts.length === 0 || changedProducts.indexOf(a) !== -1) {
        respondentUtilities[x][a] = calculateProductUtilityForRespondent(respondents[x], products[a]);
      }

      // Calculate the exponent of the total utility for this product and store it
      if (products[a].productEnabled) {

        var productExponent = products[a].exponent;
        if (typeof productExponent === 'undefined' || !simulator.useProductExponents)
          productExponent = simulator.exponent;

        exponents[a] = products[a].distribution * 1 * Math.exp(productExponent * respondentUtilities[x][a]);

      } else {
        exponents[a] = 0;
      }
    }

    if (simulator.debugging)
      debuggingInfo.exponents.push(exponents);

    // Insert actual respondent none utility variables here
    var noneUtility = respondents[x].noneUtility;
    var noneWeight = 1;

    // Calculate the exponent for the none option
    var noneUtilityExponent = noneEnabled ? noneWeight * Math.exp(simulator.exponent * noneUtility) : 0;
    var topX = 0;

    // If we are calculating Share of Preference
    if (calculationMethod === 'sop') {
      topX = products.length;
    } else if (calculationMethod === 'fc') { // If we are calculating for 1st choice we just increase the counter for this product by one
      topX = 1;
    } else if (calculationMethod === 'topx') {
      topX = simulator.topx;
    } else if (calculationMethod === 'respspec') {
      if (respondents[x].calculationMethod === 'fc') {
        topX = 1;
      } else if (respondents[x].calculationMethod === 'sop') {
        topX = products.length;
      } else if (respondents[x].calculationMethod === 'topx') {
        topX = respondents[x].topxn;
      }
    }

    // 1. Prepare array of object-items
    var exponentObjectArray = [];

    for (var b = 0; b < exponents.length; b++) {
      exponentObjectArray.push({ exponent: exponents[b], product: b, respondentUtility: respondentUtilities[x][b] });
    }

    // Add the none-option
    if (noneEnabled) {
      exponentObjectArray.push({ exponent: noneUtilityExponent, product: exponents.length, respondentUtility: noneUtility });
    }

    // 2. Sort array of exponents
    exponentObjectArray.sort(function(a, b) { return b.exponent - a.exponent; });

    // 3. Find X-highest value of exponents
    var topXHighestRanking = exponentObjectArray[topX - 1];

    // 4. Filter row to only have products with exponent X or higher
    var filteredExponentObjectArray = exponentObjectArray.filter(checkThreshold, { threshold: topXHighestRanking.exponent });

    if (simulator.debugging) {

      var summedUtilities = 0;

      for (var debugZ = 0; debugZ < filteredExponentObjectArray.length; debugZ++) {

        summedUtilities += filteredExponentObjectArray[debugZ].respondentUtility;

      }

      debuggingInfo.summedUsedUtilities.push(summedUtilities);

      var respUtil = [];

      for (debugZ = 0; debugZ < exponentObjectArray.length; debugZ++) {

        var productUtil = 0;

        for (var debugY = 0; debugY < filteredExponentObjectArray.length; debugY++) {

          if (filteredExponentObjectArray[debugY].product === debugZ) {

            productUtil = filteredExponentObjectArray[debugY].exponent;

          }

        }

        respUtil.push(productUtil);

      }

      debuggingInfo.productSharePerRespondent.push(respUtil);

    }

    // 5. Calculate share of preference within remaining group of products
    var totalFilteredExponent = 0;

    // We determine the total exponent
    for (var f = 0; f < filteredExponentObjectArray.length; f++) {
      totalFilteredExponent += filteredExponentObjectArray[f].exponent;
    }

    respondentShares[x] = [];

    // Then we calculate the share of the total for each product for this respondent and add it to the total
    for (f = 0; f < filteredExponentObjectArray.length; f++) {
      tempShares[filteredExponentObjectArray[f].product] += 1 * (filteredExponentObjectArray[f].exponent / totalFilteredExponent);
      respondentShares[x][filteredExponentObjectArray[f].product] = 1 * (filteredExponentObjectArray[f].exponent / totalFilteredExponent);
    }

    postMessage({ type: 'update', message: x + 1 });

  }

  var totalTempShares = 0;

  for (var n = 0; n < tempShares.length; n++) {

    totalTempShares += tempShares[n];

  }

  for (n = 0; n < tempShares.length; n++) {
    tempShares[n] = tempShares[n] / totalTempShares;
    tempShares[n] = tempShares[n] * 100;

    // Scale share to sharescaling variable
    tempShares[n] = tempShares[n] * (simulator.shareScaling / 100);
  }

  // If none is not enabled, remove last share from array for unit test compatibility
  // TODO: Save none in seprate array so this isnt neccessary
  if (!noneEnabled) {
    tempShares.splice(-1, 1);
  }

  return tempShares;
}

function calculateProductUtilityForRespondent(respondent, product) {

  // The X offset in the utility row to compensate for already counted attributes
  var attributeOffset = 0;

  // The current product utility total
  var countUtility = 0;

  // Now for this product, loop through all the attributes and add the utilities together
  for (var y = 0; y < attributes.attributeList.length && product.productEnabled; y++) {
    // If the attribute type is category we just take the product level and find the utility matching it
    if (attributes.attributeList[y].type === 'Category') {
      // Find the utility in position <productlevel> + attributeOffset
      var utility = respondent.utilityData[attributeOffset + parseInt(product.attributeData[y], 10) - 1];

      // Then we parse the utility (change "1,423" to 1.423) and it it to the subtotal
      countUtility += parseFloat(utility.replace(',', '.'));

      attributeOffset += attributes.attributeList[y].levels.length;

    } else if (attributes.attributeList[y].type === 'Interpolation') { // If the attribute is an interpolated one, we need to compose the utility out of the 2 surrounding levels
      // Get the actual value we want to calculate the utility for
      var interpolatedValue = parseFloat(product.attributeData[y]);

      // Values to determine the lower and upper bounds of the surrounding levels we need to determine
      var lowerIndex = 0;
      var upperIndex = 0;

      // We loop through all the levels until we find a level bigger then interpolatedValue
      while (parseFloat(attributes.attributeList[y].levels[upperIndex]) <= interpolatedValue) {
        upperIndex++;
      }

      // We then set our lowerIndex one level lower then our upper index
      // We also make sure that the lower index can't be negative, this can occur if the interpolated value
      // matches exactly with the lowest possible level. By making it 0 in this case the range will (as appropriate)
      // also be 0 and the first value will not be taken into account
      lowerIndex = Math.max(upperIndex - 1, 0);

      // Make sure our upper bound doesn't go too high
      // This occurs when the slopeValue matches the highest value of our slope levels
      upperIndex = Math.min(attributes.attributeList[y].levels.length - 1, upperIndex);

      // Now we determine the actual value range that needs to be interpolated (upper bound - lower bound)
      var interpolationRange = parseFloat(attributes.attributeList[y].levels[upperIndex]) - parseFloat(attributes.attributeList[y].levels[lowerIndex]);

      // And we calculate the distance of the value (value - lower bound)
      var interpolationDistance = interpolatedValue - parseFloat(attributes.attributeList[y].levels[lowerIndex]);

      // If the range is 0, it means our value is equal to an existing level
      // We make the range 1 to  fix the calculation
      if (interpolationRange === 0) {
        interpolationRange = 1;
      }

      // Determine the ratio of interpolation, in case of being equal to a level this
      // will be 0 / 1 (see correction above here) and give us the correct ratio of 0
      var interpolationRatio = interpolationDistance / interpolationRange;

      // Calculate both the lower and upper utility with appropriate ratio weight
      var countUtilityLower = parseFloat(respondent.utilityData[attributeOffset + lowerIndex].replace(',', '.')) * (1 - interpolationRatio);
      var countUtilityUpper = parseFloat(respondent.utilityData[attributeOffset + upperIndex].replace(',', '.')) * interpolationRatio;

      // Add them together and update the subtotal of the utility
      countUtility += countUtilityLower + countUtilityUpper;

      attributeOffset += attributes.attributeList[y].levels.length;

    } else if (attributes.attributeList[y].type === 'Slope') {

      // Get the actual value we want to calculate the utility for
      interpolatedValue = parseFloat(product.attributeData[y]);

      // Get the slope we want to use for the utility
      var selectedSlope = product.activeSlopes[y];

      var z = 0;

      // If selected slope === 0 we want to have a utility of 0 and offset all levels
      if (selectedSlope !== [0]) {

        var slopeOffset = 0;
        var valueSlope = [];
        var valueIsInSlope = false;
        var maxInSlope = 0;

        for (var c = 0; c < attributes.attributeList[y].levels.length; c++) {
          var min = Math.min.apply(null, attributes.attributeList[y].levels[c]);
          var max = Math.max.apply(null, attributes.attributeList[y].levels[c]);

          // This code can be rewritten as:
          // valueIsInSlope = !!Math.max(valueIsInSlope,(interpolatedValue >= min && interpolatedValue <= max));
          // Why would anyone do that? Because some people are monsters. Be afraid.
          if (interpolatedValue >= min && interpolatedValue <= max && selectedSlope.indexOf(c + 1) !== -1) {
            valueIsInSlope = true;
            valueSlope = attributes.attributeList[y].levels[c];
            maxInSlope = max;
          } else if (!valueIsInSlope) {
            slopeOffset += (attributes.attributeList[y].levels[c].length - 1);
          }
        }

        // Values to determine the lower and upper bounds of the surrounding levels we need to determine
        lowerIndex = 0;
        upperIndex = 0;

        var slopeUtility = 0;

        // We loop through all the levels until we find a level bigger then interpolatedValue
        while (parseFloat(valueSlope[upperIndex]) <= interpolatedValue) {
          upperIndex++;

          if (parseFloat(valueSlope[upperIndex]) <= interpolatedValue) { // Want full utility of this slope
            slopeUtility += parseFloat(respondent.utilityData[attributeOffset + slopeOffset + upperIndex - 1].replace(',', '.'));
          }
        }

        // We then set our lowerIndex one level lower then our upper index
        // We also make sure that the lower index can't be negative, this can occur if the interpolated value
        // matches exactly with the lowest possible level. By making it 0 in this case the range will (as appropriate)
        // also be 0 and the first value will not be taken into account
        lowerIndex = Math.max(upperIndex - 1, 0);

        // Make sure our upper bound doesn't go too high
        // This occurs when the slopeValue matches the highest value of our slope levels
        upperIndex = Math.min(valueSlope.length - 1, upperIndex);

        // Also make sure the lower index (which will act as the upper index for the utility array) isnt out of bounds there (which will
        // happen if our value is exactly on the top level)
        lowerIndex = Math.min(valueSlope.length - 2, lowerIndex);

        // Now we determine the actual value range that needs to be interpolated (upper bound - lower bound)
        interpolationRange = parseFloat(valueSlope[upperIndex]) - parseFloat(valueSlope[lowerIndex]);

        // And we calculate the distance of the value (value - lower bound)
        interpolationDistance = interpolatedValue - parseFloat(valueSlope[lowerIndex]);

        // If the range is 0, it means our value is equal to an existing level
        // We make the range 1 to  fix the calculation
        if (interpolationRange === 0) {
          interpolationRange = 1;
        }

        // Determine the ratio of interpolation, in case of being equal to a level this
        // will be 0 / 1 (see correction above here) and give us the correct ratio of 0
        interpolationRatio = interpolationDistance / interpolationRange;

        // Calculate the lower utility with appropriate ratio weight
        countUtilityLower = parseFloat(respondent.utilityData[attributeOffset + slopeOffset + lowerIndex].replace(',', '.')) * interpolationRatio;

        // TODO: Find a cleaner way to set countUtilityLower to zero, when the interpolated value is equal to the highest of the slope. Although? Is it really hacking when you are trying to teach a computer to simulate a whole economic market?
        if (maxInSlope === interpolatedValue)
          countUtilityLower = 0;

        // Add them together and update the subtotal of the utility
        if (valueIsInSlope) {
          countUtility += countUtilityLower + slopeUtility;
        } else {
          countUtility += 0;
        }

      }

      // Once we are done with this attribute, add the amount of levels in this attribute to
      // the offset to make sure we get the right utilities in the row
      for (var k = 0; k < attributes.attributeList[y].levels.length; k++) {
        attributeOffset += attributes.attributeList[y].levels[k].length - 1;
      }

    }
  }

  return countUtility;
}
