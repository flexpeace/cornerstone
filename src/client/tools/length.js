var cornerstoneTools = (function ($, cornerstone, csc, cornerstoneTools) {

    if(cornerstoneTools === undefined) {
        cornerstoneTools = {};
    }

    function drawNewMeasurement(e, data, coords, scale)
    {
        data.handles.start.x = coords.x;
        data.handles.start.y = coords.y;
        data.handles.end.x = coords.x;
        data.handles.end.y = coords.y;
        data.visible = true;

        cornerstoneTools.handleCursorNearHandle(e, data, coords, scale);
    };

    function onMouseDown(e) {
        var element = e.currentTarget;
        var viewport = cornerstone.getViewport(element);
        var data = cornerstone.getElementData(element, 'length');
        if(e.which == data.whichMouseButton) {
            var coords = cornerstone.pageToImage(element, e.pageX, e.pageY);

            // if we have a visible length measurement, check to see if this point
            // is near one of its handles
            if(cornerstoneTools.handleCursorNearHandle(e, data, coords, viewport.scale) == true) {
                e.stopPropagation();
                return;
            }
            else
            {
                drawNewMeasurement(e, data, coords, viewport.scale);
                e.stopPropagation();
                return;
            }
        }
    };


    function onImageRendered(e)
    {
        var data = cornerstone.getElementData(e.currentTarget, 'length');

        if(data.visible == false)
        {
            return;
        }

        csc.setToPixelCoordinateSystem(e.detail.enabledElement, e.detail.canvasContext);

        var context = e.detail.canvasContext;
        context.beginPath();
        context.strokeStyle = 'white';
        context.lineWidth = 1 / e.detail.viewport.scale;
        context.moveTo(data.handles.start.x, data.handles.start.y);
        context.lineTo(data.handles.end.x, data.handles.end.y);
        context.stroke();
        context.beginPath();

        cornerstoneTools.drawHandles(context, e.detail.viewport, data.handles, e.detail.viewport.scale);
        context.stroke();
        context.fillStyle = "white";
        var dx = data.handles.start.x - data.handles.end.x * e.detail.image.columnPixelSpacing;
        var dy = data.handles.start.y - data.handles.end.y * e.detail.image.rowPixelSpacing;
        var length = Math.sqrt(dx * dx + dy * dy);
        var text = "" + length.toFixed(2) + " mm";

        var fontParameters = csc.setToFontCoordinateSystem(e.detail.enabledElement, e.detail.canvasContext, 15);
        context.font = "" + fontParameters.fontSize + "px Arial";

        var textX = (data.handles.start.x + data.handles.end.x) / 2 / fontParameters.fontScale;
        var textY = (data.handles.start.y + data.handles.end.y) / 2 / fontParameters.fontScale;
        context.fillText(text, textX, textY);
    };


    function onMouseMove(e)
    {
        // if a mouse button is down, ignore it
        if(e.which != 0) {
            return;
        }

        // get the data associated with this element or return if none
        var element = e.currentTarget;
        var data = cornerstone.getElementData(element, 'length');
        if(data === undefined) {
            return;
        }

        // get the cursor position in image coordinates
        var coords = cornerstone.pageToImage(element, e.pageX, e.pageY);

        var viewport = cornerstone.getViewport(element);

        if(cornerstoneTools.activateNearbyHandle(data.handles, coords, viewport.scale ) == true)
        {
            cornerstone.updateImage(element);
        }
    };

    function enableLength(element, whichMouseButton)
    {
        element.addEventListener("CornerstoneImageRendered", onImageRendered, false);

        var eventData =
        {
            whichMouseButton: whichMouseButton,
            visible : false,
            active: false,
            handles: {
                start: {
                    x:0,
                    y:0,
                    active: false
                },
                end: {
                    x:0,
                    y:0,
                    active: false
                }
            }
        };

        var data = cornerstone.getElementData(element, 'length');
        for(var attrname in eventData)
        {
            data[attrname] = eventData[attrname];
        }

        $(element).mousedown(onMouseDown);
        $(element).mousemove(onMouseMove);
    };

    function disableLength(element)
    {
        element.removeEventListener("CornerstoneImageRendered", onImageRendered);
        $(element).unbind('mousedown', onMouseDown);
        cornerstone.removeElementData(element, 'length');
    };

    // module/private exports
    cornerstoneTools.enableLength = enableLength;
    cornerstoneTools.disableLength = disableLength;

    return cornerstoneTools;
}($, cornerstone, cornerstoneCore, cornerstoneTools));