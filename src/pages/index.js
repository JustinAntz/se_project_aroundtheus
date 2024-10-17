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
  addFormValidator.resetValidation();
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

// const editProfileModal = document.querySelector("#edit-modal");
// const addCardModal = document.querySelector("#add-card-modal");
// const previewImageModal = document.querySelector("#preview-image-modal");

// const profileModalClose = editProfileModal.querySelector(".modal__close");
// const addCardModalClose = addCardModal.querySelector(".modal__close");
// const previewImageClose = previewImageModal.querySelector(".modal__close");

// const profileName = document.querySelector(".profile__name");
// const profileDescription = document.querySelector(".profile__description");

// const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
// const cardUrlInput = addCardForm.querySelector(".modal__input_type_url");

const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

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
// function closeModal(modal) {
//   modal.classList.remove("modal_opened");
//   document.removeEventListener("keydown", handleCloseEscape);
// }

// function openModal(modal) {
//   modal.classList.add("modal_opened");
//   document.addEventListener("keydown", handleCloseEscape);
// }

function handleImageClick(name, link) {
  previewImageModal.open(name, link);
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.getView();
}

function renderCard(cardData) {
  const card = createCard(cardData);
  cardListEl.prepend(card);
}

/* -------------------------------------------------------------------------- */
/*                               Event Handlers                               */
/* -------------------------------------------------------------------------- */
// function handleProfileEditSubmit(e) {
//   e.preventDefault();
//   const formData = editProfileModal.getInputValues();
//   userInfo.setUserInfo({
//     name: formData.name,
//     job: formData.description,
//   });
//   editProfileModal.close();
// }

// function handleAddCardSubmit(e) {
//   e.preventDefault();
//   const name = cardTitleInput.value;
//   const link = cardUrlInput.value;
//   renderCard({ name, link });
//   closeModal(addCardModal);
//   e.target.reset();
//   addFormValidator.resetValidation();
//   addFormValidator.disableButton();
// }

// function handleCloseOverlay(e) {
//   if (e.target.classList.contains("modal_opened")) {
//     closeModal(e.target);
//   }
// }

function handleCloseEscape(e) {
  if (e.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
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

// profileModalClose.addEventListener("click", () => closeModal(editProfileModal));
// addCardModalClose.addEventListener("click", () => closeModal(addCardModal));
// previewImageClose.addEventListener("click", () =>
//   closeModal(previewImageModal)
// );

// editProfileModal.addEventListener("click", handleCloseOverlay);
// addCardModal.addEventListener("click", handleCloseOverlay);
// previewImageModal.addEventListener("click", handleCloseOverlay);

// profileEditForm.addEventListener("submit", handleProfileEditSubmit);
// addCardForm.addEventListener("submit", handleAddCardSubmit);

// initialCards.forEach((cardData) => renderCard(cardData));

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
