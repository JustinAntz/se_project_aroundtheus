import "./index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import { initialCards, data, config } from "../utils/consants.js";

/* -------------------------------------------------------------------------- */
/*                                 Instantiate                                */
/* -------------------------------------------------------------------------- */
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__description",
});

const editProfileModal = new PopupWithForm("#edit-modal", (data) => {
  userInfo.setUserInfo({
    name: data.name,
    job: data.description,
  });
  editProfileModal.close();
});
editProfileModal.setEventListeners();

const addCardModal = new PopupWithForm("#add-card-modal", (data) => {
  renderCard({ name: data.title, link: data.url });
  addCardModal.close();
  addFormValidator.disableButton();
});
addCardModal.setEventListeners();

const previewImageModal = new PopupWithImage("#preview-image-modal");
previewImageModal.setEventListeners();

/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
/* -------------------------------------------------------------------------- */
const editButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");

/* -------------------------------------------------------------------------- */
/*                                 Validation                                 */
/* -------------------------------------------------------------------------- */

const profileEditForm = document.querySelector("#edit-modal .modal__form");
const addCardForm = document.querySelector("#add-card-modal .modal__form");

const editFormValidator = new FormValidator(config, profileEditForm);
const addFormValidator = new FormValidator(config, addCardForm);

editFormValidator.enableValidation();
addFormValidator.enableValidation();

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
function handleImageClick(name, link) {
  previewImageModal.open(name, link);
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.getView();
}

function renderCard(cardData) {
  const card = createCard(cardData);
  cardSection.prependItem(card);
}
/* -------------------------------------------------------------------------- */
/*                               Event Listeners                              */
/* -------------------------------------------------------------------------- */
const profileNameInput = profileEditForm.querySelector("#profile-name-input");
const profileDescriptionInput = profileEditForm.querySelector(
  "#profile-description-input"
);

editButton.addEventListener("click", () => {
  const { name, job } = userInfo.getUserInfo();
  profileNameInput.value = name;
  profileDescriptionInput.value = job;
  editProfileModal.open();
});

addNewCardButton.addEventListener("click", () => addCardModal.open());

/* -------------------------------------------------------------------------- */
/*                             Initialize Section                             */
/* -------------------------------------------------------------------------- */
const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const card = createCard(cardData);
      cardSection.addItem(card);
    },
  },
  ".cards__list"
);

cardSection.renderItems();
