import { LightningElement, api } from "lwc";
//Method used to close action modal
import { CloseActionScreenEvent } from "lightning/actions";
//Method used to update records
import { updateRecord } from "lightning/uiRecordApi";
//Method used to generate toast
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//Method used to get Address List with an external API
import getAddressList from "@salesforce/apex/AddressFinderREST.getAddressList";

//Schema imports
import ID_FIELD from "@salesforce/schema/Account.Id";
import BILLINGCITY_FIELD from "@salesforce/schema/Account.BillingCity";
import BILLINGCOUNTRY_FIELD from "@salesforce/schema/Account.BillingCountry";
import BILLINGLATITUDE_FIELD from "@salesforce/schema/Account.BillingLatitude";
import BILLINGLONGITUDE_FIELD from "@salesforce/schema/Account.BillingLongitude";
import BILLINGPOSTALCODE_FIELD from "@salesforce/schema/Account.BillingPostalCode";
import BILLINGSTATE_FIELD from "@salesforce/schema/Account.BillingState";
import BILLINGSTREET_FIELD from "@salesforce/schema/Account.BillingStreet";

export default class addressFinder extends LightningElement {
  @api recordId;
  searchLoad = false;
  showAddress = false;
  optAddress = [];
  selAddress;
  postCode = "";
  error;
  resAddressFinder;

  /**
   * @description Method to get address list after pressing enter key
   * @author lunuro
   * @date 18/12/2022
   * @param {*} event
   * @memberof addressFinder
   */
  handleEnter(event) {
    if (event.keyCode === 13) {
      this.searchLoad = true;
      this.getAddress();
    }
  }

  /**
   * @description Method to save changes in postcode input
   * @author lunuro
   * @date 18/12/2022
   * @param {*} event
   * @memberof addressFinder
   */
  handleChangeSearch(event) {
    this.postCode = event.target.value;
  }

  /**
   * @description Method to get address list that correspond to the postcode
   * @author lunuro
   * @date 18/12/2022
   * @return {*}
   * @memberof addressFinder
   */
  getAddress() {
    //Avoid to call if the address is not filled
    if (!this.postCode) {
      return;
    }

    //Obtain address data from external endpoint
    getAddressList({ postCode: this.postCode })
      .then((result) => {
        this.searchLoad = false;
        if (!result || result.includes("Error")) {
          let errMess = result.includes("Error") ? " Error " + result : "";
          this.generateToast(
            "An error ocurred while getting addresses",
            "Please contact your admin for help." + errMess,
            "error"
          );
        }
        if (result === "Postcode invalid") {
          this.generateToast(
            "The postcode is invalid",
            result.message,
            "error"
          );
        } else {
          this.resAddressFinder = JSON.parse(result);
          this.optAddress = [];
          this.resAddressFinder.addresses.forEach((item, index) => {
            let curAddress = item.formatted_address.toString();
            let opt = {
              label: curAddress,
              value: curAddress
            };
            this.optAddress.push(opt);
            if (index === 0) {
              this.selAddress = curAddress;
            }
          });
          this.showAddress = true;
        }
      })
      .catch((error) => {
        this.searchLoad = false;
        this.generateToast(
          "Error while getting the addresses",
          "Please contact your admin for help. Error: " + error.message,
          "error"
        );
      });
  }

  /**
   * @description Method to save changes in address selector
   * @author lunuro
   * @date 18/12/2022
   * @param {*} event
   * @memberof addressFinder
   */
  handleChangeAddress(event) {
    this.selAddress = event.detail.value;
    this.template.querySelector(".divOptions").classList.remove("divLarge");
  }

  /**
   * @description Method to handle open address selector
   * @author lunuro
   * @date 18/12/2022
   * @memberof addressFinder
   */
  handleOpenOptions() {
    this.template.querySelector(".divOptions").classList.add("divLarge");
  }

  /**
   * @description Method to close action modal after cancel button is pressed
   * @author lunuro
   * @date 18/12/2022
   * @memberof addressFinder
   */
  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  /**
   * @description Method to update address after save button is pressed
   * @author lunuro
   * @date 18/12/2022
   * @return {*}
   * @memberof addressFinder
   */
  handleSave() {
    if (!this.postCode || !this.optAddress) {
      return;
    }
    let arrSelAddress;
    this.resAddressFinder.addresses.forEach((sel) => {
      if (sel.formatted_address.toString() === this.selAddress) {
        arrSelAddress = sel;
      }
    });
    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.recordId;
    fields[BILLINGCITY_FIELD.fieldApiName] = arrSelAddress.town_or_city;
    fields[BILLINGCOUNTRY_FIELD.fieldApiName] = arrSelAddress.country;
    fields[BILLINGLATITUDE_FIELD.fieldApiName] = this.resAddressFinder.latitude;
    fields[BILLINGLONGITUDE_FIELD.fieldApiName] =
      this.resAddressFinder.longitude;
    fields[BILLINGPOSTALCODE_FIELD.fieldApiName] =
      this.resAddressFinder.postCode;
    fields[BILLINGSTATE_FIELD.fieldApiName] = arrSelAddress.district;
    fields[BILLINGSTREET_FIELD.fieldApiName] = arrSelAddress.line_1;

    const recordInput = { fields };
    updateRecord(recordInput)
      .then(() => {
        this.generateToast("Success", "Address updated", "success");
        this.dispatchEvent(new CloseActionScreenEvent());
      })
      .catch((error) => {
        let errMess = !error.body ? error.message : error.body.message;
        this.generateToast(
          "Error while updating the address",
          "Please contact your admin for help. Error: " + errMess,
          "error"
        );
      });
  }

  /**
   * @description Method to generate toast
   * @author lunuro
   * @date 18/12/2022
   * @param {*} title
   * @param {*} message
   * @param {*} variant
   * @memberof addressFinder
   */
  generateToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }
}
