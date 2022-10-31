var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var GameMainUI = (function (_super) {
        __extends(GameMainUI, _super);
        function GameMainUI() {
            return _super.call(this) || this;
        }
        GameMainUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.GameMainUI.uiView);
        };
        return GameMainUI;
    }(View));
    GameMainUI.uiView = { "type": "View", "props": {}, "compId": 1, "child": [{ "type": "Image", "props": { "var": "map", "skin": "map/tile_map.png", "pivotY": 750, "pivotX": 1500 }, "compId": 2 }, { "type": "Label", "props": { "y": 10, "x": 10, "text": "长度：", "styleSkin": "comp/label.png" }, "compId": 4 }, { "type": "Label", "props": { "y": 10, "x": 44, "var": "text_length", "text": "0", "styleSkin": "comp/label.png" }, "compId": 5 }, { "type": "Label", "props": { "y": 26, "x": 10, "text": "击杀：", "styleSkin": "comp/label.png" }, "compId": 6 }, { "type": "Label", "props": { "y": 26, "x": 44, "var": "text_kill", "text": "0", "styleSkin": "comp/label.png" }, "compId": 7 }, { "type": "Image", "props": { "y": 10, "x": 489, "width": 102, "var": "mask_rank", "skin": "images/mask.png", "height": 133 }, "compId": 8 }, { "type": "Button", "props": { "y": 321, "x": 511, "var": "ctrl_flash", "stateNum": 2, "skin": "images/control-flash.png", "pivotY": 40, "pivotX": 40 }, "compId": 9 }, { "type": "Image", "props": { "y": 329, "x": 85, "var": "ctrl_back", "skin": "images/control-back.png", "pivotY": 40, "pivotX": 40 }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 40, "x": 40, "var": "ctrl_rocker", "skin": "images/control-rocker.png", "pivotY": 17.5, "pivotX": 17.5 }, "compId": 11 }] }, { "type": "Image", "props": { "y": 357, "x": -32, "visible": false, "var": "ctrl_rocker_move", "skin": "images/control-rocker.png", "pivotY": 17.5, "pivotX": 17.5 }, "compId": 12 }], "loadList": ["map/tile_map.png", "comp/label.png", "images/mask.png", "comp/bg.png", "images/control-flash.png", "comp/button.png", "images/control-back.png", "images/control-rocker.png"], "loadList3D": [] };
    ui.GameMainUI = GameMainUI;
})(ui || (ui = {}));
(function (ui) {
    var GameStartUI = (function (_super) {
        __extends(GameStartUI, _super);
        function GameStartUI() {
            return _super.call(this) || this;
        }
        GameStartUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.GameStartUI.uiView);
        };
        return GameStartUI;
    }(View));
    GameStartUI.uiView = { "type": "View", "props": { "skin": "images/head2.png" }, "compId": 1, "child": [{ "type": "Image", "props": { "var": "background", "skin": "images/s1-background.jpg", "pivotY": 297, "pivotX": 594, "name": "background" }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 204.5, "x": 394.5, "width": 399, "skin": "images/s1-option-background.png", "name": "option_background", "height": 211 }, "compId": 8, "child": [{ "type": "RadioGroup", "props": { "y": 50, "x": 51, "var": "skinRadio", "space": -3, "skin": "images/s1-radio.png", "selectedIndex": 0, "labels": "  红色,  蓝色,  绿色,  紫色,  棕色", "labelPadding": "4", "direction": "vertical" }, "compId": 7 }, { "type": "Image", "props": { "y": 54, "x": 133, "width": 12, "skin": "images/head1.png", "rotation": 90, "height": 12 }, "compId": 9 }, { "type": "Image", "props": { "y": 75, "x": 133, "width": 12, "skin": "images/head2.png", "rotation": 90, "height": 12 }, "compId": 15 }, { "type": "Image", "props": { "y": 97, "x": 133, "width": 12, "skin": "images/head3.png", "rotation": 90, "height": 12 }, "compId": 16 }, { "type": "Image", "props": { "y": 118, "x": 133, "width": 12, "skin": "images/head4.png", "rotation": 90, "height": 12 }, "compId": 17 }, { "type": "Image", "props": { "y": 139, "x": 133, "width": 12, "skin": "images/head5.png", "rotation": 90, "height": 12 }, "compId": 18 }, { "type": "Button", "props": { "y": 14, "x": 234, "var": "btn_single", "stateNum": 1, "skin": "images/s1-btn1.png", "labelPadding": "-20", "labelBold": true, "label": "单人模式" }, "compId": 21 }, { "type": "Button", "props": { "y": 113, "x": 234, "var": "btn_net", "stateNum": 1, "skin": "images/s1-btn2.png", "labelPadding": "-20", "labelBold": true, "label": "多人模式" }, "compId": 22 }, { "type": "Button", "props": { "y": 13, "x": 46, "width": 126, "var": "nickname", "stateNum": 1, "skin": "images/s1-input.png", "label": "昵称", "height": 24 }, "compId": 23 }, { "type": "Button", "props": { "y": 166, "x": 46, "width": 126, "var": "neturl", "stateNum": 1, "skin": "images/s1-input.png", "label": "192.168.1.60", "height": 24 }, "compId": 24 }, { "type": "Label", "props": { "y": -31, "x": 139.5, "text": "贪吃蛇小作战", "styleSkin": "comp/label.png", "fontSize": 20, "font": "Microsoft Yahei", "color": "#226eaa", "bold": true }, "compId": 25 }, { "type": "TextInput", "props": { "y": 190.5, "x": 161.5, "text": "TextInput", "skin": "comp/textinput.png" }, "compId": 26 }] }] }], "loadList": ["images/head2.png", "images/s1-background.jpg", "images/s1-option-background.png", "images/s1-radio.png", "comp/radiogroup.png", "images/head1.png", "images/head3.png", "images/head4.png", "images/head5.png", "images/s1-btn1.png", "comp/button.png", "images/s1-btn2.png", "images/s1-input.png", "comp/label.png", "comp/textinput.png"], "loadList3D": [] };
    ui.GameStartUI = GameStartUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map