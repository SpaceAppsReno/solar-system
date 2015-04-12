"use strict";var WebStorage=function(storageType){this.type=null,this.webStorage=null,this.isSupported=this.checkSupportFor(storageType)};WebStorage.prototype.serialize=function(value){return JSON.serialize(value)},WebStorage.prototype.deserialize=function(value){return JSON.deserialize(value)},WebStorage.prototype.encode=function(value){return btoa(value)},WebStorage.prototype.decode=function(value){return atob(value)},WebStorage.prototype.checkSupportFor=function(storageType){return storageType in window&&null!=window[storageType]?(this.webStorage=window[storageType],this.type=storageType,!0):!1},WebStorage.prototype.set=function(key,value){if(this.isSupported){void 0===typeof value&&(value=null);try{return(angular.isObject(value)||angular.isArray(value))&&(value=this.serialize(value)),null!==value&&(value=this.encode(value)),this.webStorage.setItem(key,value),!0}catch(error){return console.error("Unable to save key "+key+" to "+this.type),!1}}return!1},WebStorage.prototype.get=function(key){if(this.isSupported){var value="";try{value=this.webStorage.getItem(key)}catch(error){throw console.error("Error attempting to get key "+key+" from "+this.type),new Error("Unable to get stored preference")}return value||(value=null),null!==value&&(value=this.decode(value),("{"===value.charAt(0)||"["===value.charAt(0))&&(value=this.deserialize(value))),value}return void 0},WebStorage.prototype.remove=function(key){if(this.isSupported)try{return this.webStorage.removeItem(key),!0}catch(error){return console.error("Error occurred while trying to remove key "+key+" from "+this.type),!1}return!1},WebStorage.prototype.clear=function(){if(this.isSupported)try{return this.webStorage.clear(),!0}catch(error){return console.error("Error occurred while trying to clear ALL data from "+this.type),!1}return!1};var WebStorageMOD=angular.module("jp.WebStorage",[]);WebStorageMOD.factory("jp_WebStorage",[function(){var local=new WebStorage("localStorage"),session=new WebStorage("sessionStorage");return{local:local,session:session}}]);