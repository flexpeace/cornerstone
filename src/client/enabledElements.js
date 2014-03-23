var cornerstone = (function (cornerstone, csc) {
    if(cornerstone === undefined) {
        cornerstone = {};
    }

    var enabledElements = [];

    function getEnabledElement(element) {
        for(var i=0; i < enabledElements.length; i++) {
            if(enabledElements[i].element == element) {
                return enabledElements[i];
            }
        }
        return undefined;
    };

    function addEnabledElement(el) {
        enabledElements.push(el);
    };

    function getElementData(el, dataType) {
        var ee = getEnabledElement(el);
        if(ee.data.hasOwnProperty(dataType) == false)
        {
            ee.data[dataType] = {};
        }
        return ee.data[dataType];
    };
    function removeElementData(el, dataType) {
        var ee = getEnabledElement(el);
        delete ee.data[dataType];
    };


    // module/private exports
    cornerstone.getEnabledElement = getEnabledElement;
    cornerstone.addEnabledElement = addEnabledElement;
    cornerstone.getElementData = getElementData;
    cornerstone.removeElementData = removeElementData;

    return cornerstone;
}(cornerstone, cornerstoneCore));