import Popup from "./Popup.js";

export default class MenuPopup extends Popup {
  constructor({ container }) {
    super({ container, className:'popup_type_menu' })
  }
}
