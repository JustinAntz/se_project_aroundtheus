import "./index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import Api from "../components/Api.js";
import { initialCards, data, config } from "../utils/consants.js";

/* -------------------------------------------------------------------------- */
/*                                 Instantiate                                */
/* -------------------------------------------------------------------------- */
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ae2246ec-ce59-402a-a444-0dcdf78c5d1e",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__picture",
});

api
  .getUserInfo()
  .then((data) => {
    userInfo.setUserInfo({
      name: data.name,
      job: data.about,
      avatar: data.avatar,
    });
  })
  .catch((err) => console.error(err));

const editProfileModal = new PopupWithForm("#edit-modal", (data) => {
  api
    .updateUserInfo({
      name: data.name,
      job: data.description,
    })
    .then((res) => {
      userInfo.setUserInfo({
        name: res.name,
        job: res.about,
      });
      editProfileModal.close();
    })
    .catch((err) => console.error(err));
});
editProfileModal.setEventListeners();

const addCardModal = new PopupWithForm("#add-card-modal", (data) => {
  api
    .addCard(data)
    .then((res) => {
      const card = createCard({ name: res.name, link: res.link });
      cardSection.addItem(card);
      addCardModal.close();
      addFormValidator.reset();
      addFormValidator.disableButton();
    })
    .catch((err) => console.error(err));
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

// function renderCard(cardData) {
//   const card = createCard(cardData);
//   cardSection.prependItem(card);
// }
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
