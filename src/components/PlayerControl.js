
import './PlayerControl.css';
import {processPointerEvent} from '../utils/Utilities';
const PlayerControl = ({
        children,
        onPressUp, 
        onPressDown, 
        onPressLeft, 
        onPressRight, 
        onPressSpace,
        onReleaseUp, 
        onReleaseDown, 
        onReleaseLeft, 
        onReleaseRight, 
        onReleaseSpace,
        onPointerStart,
        onPointerChange,
        onPointerStop        
}) => {
    const dragStatus = {
        dragging: false,
        dragStart: {x:0,y:0},
        lastPosition: null,
    };
    const keys = {
        up: {codes: [38], downHandler: () => {if (onPressUp) onPressUp()}, upHandler: () => {if (onReleaseUp) onReleaseUp()}},
        down: {codes: [40], downHandler: () => {if (onPressDown) onPressDown()}, upHandler: () => {if (onReleaseDown) onReleaseDown()}},
        left: {codes: [37], downHandler: () => {if (onPressLeft) onPressLeft()}, upHandler: () => {if (onReleaseLeft) onReleaseLeft()}},
        right: {codes: [39], downHandler: () => {if (onPressRight) onPressRight()}, upHandler: () => {if (onReleaseRight) onReleaseRight()}},
        space: {codes: [32], downHandler: () => {if (onPressSpace) onPressSpace()}, upHandler: () => {if (onReleaseSpace) onReleaseSpace()}},
    }
    const keyDown = (e) => {
        const code = e.keyCode;
        const pressedKeys = Object.keys(keys).filter(item => keys[item].codes.includes(code));
        if(pressedKeys.length){
            keys[pressedKeys[0]].downHandler();
            
        }
    };
    const keyUp = (e) => {
        const code = e.keyCode;
        const pressedKeys = Object.keys(keys).filter(item => keys[item].codes.includes(code));
        if(pressedKeys.length){
            keys[pressedKeys[0]].upHandler();
            
        }
    };
    const down = (e) => {
        dragStatus.dragging = true;
        dragStatus.lastPosition = processPointerEvent(e);
        dragStatus.dragStart = processPointerEvent(e);
        const mobile = e.touches && e.touches.length;
        onPointerStart({ mobile });
    };
    const move = (e) => {
        if(dragStatus.dragging){
            const tapPosition = processPointerEvent(e);
            const position = { x: dragStatus.dragStart.x-tapPosition.x, y: dragStatus.dragStart.y-tapPosition.y };
            const mobile = e.touches && e.touches.length;

            let direction = 0;
            if(Math.abs(position.x - dragStatus.lastPosition.x) > .9){
                direction = position.x > dragStatus.lastPosition.x ? 1 : -1;
            }
            onPointerChange({position, mobile, direction});
            
            dragStatus.lastPosition = position;
        }
        
    };
    const up = (e) => {
        dragStatus.dragging = false;
    };
    const upMobile = (e) => {
        dragStatus.dragging = false;
        onPointerStop({ mobile: true });
    };
    return (
        <div className="player-control">
            <div className="user-interface">
                {children}
            </div>
            <div
                className="control-overlay"
                onKeyDown={keyDown}
                onKeyUp={keyUp}
                onMouseDown={down}
                onMouseMove={move}
                onMouseUp={up}
                onTouchStart={down}
                onTouchMove={move}
                onTouchEnd={upMobile}
                tabIndex="-1"
            />
        </div>
    );
};
export default PlayerControl;