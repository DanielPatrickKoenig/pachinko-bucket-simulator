const ShapeTypes = {
    PLANE: 'plane',
    BOX: 'box',
    SPHERE: 'sphere',
    CYLINDER: 'cylinder'
}
function nextTick() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}
function degreesToRadians(value){
    return value * (Math.PI/180);
}
function radiansToDegrees(value){
    return value * (180/Math.PI);
}
function defaultDimensionValues () {
    return {
        size: { x: 1, y: 1, z: 1, r: 1 },
        position: { x: 0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    }
}
function processPointerEvent(e){
    return e.touches && e.touches.length
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };
}
function getInheritanceChain(targetObject){
    const list = [];
    let obj = targetObject;
    while(!obj.constructor || obj.constructor.name !== 'Object'){
        obj = obj.__proto__;
        list.push(obj.constructor.name);
    }
    // console.log(list);
    return list;
}
function generateID(){
    return `${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`;
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function ratioPoint (ratio, a, b) {
    return { x: a.x + ((b.x - a.x) * ratio), y: a.y + ((b.y - a.y) * ratio) };
}
function cubicBezier (ratio, startPoint, controlPoint1, controlPoint2, endPoint) {
    const startToControlPoint1 = ratioPoint(ratio, startPoint, controlPoint1);
    const controlPoint1ToEnd = ratioPoint(ratio, controlPoint2, endPoint);
    const controlPoint1toControlPoint2 = ratioPoint(ratio, controlPoint1, controlPoint2);

    const startToC1ToC1ToC2 = ratioPoint(ratio, startToControlPoint1, controlPoint1toControlPoint2);
    const c1ToC2ToC2ToEnd = ratioPoint(ratio, controlPoint1toControlPoint2, controlPoint1ToEnd);

    return ratioPoint(ratio, startToC1ToC1ToC2, c1ToC2ToC2ToEnd);
}
function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var _inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) _inside = !_inside;
    }
    
    return _inside;
}
export {nextTick, degreesToRadians, radiansToDegrees, ShapeTypes, defaultDimensionValues, processPointerEvent, generateID, getInheritanceChain, getParameterByName, cubicBezier, inside};