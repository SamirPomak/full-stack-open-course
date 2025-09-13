"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const patients_1 = __importDefault(require("../data/patients"));
const getNonSensitiveEntries = () => patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    occupation,
    gender,
}));
const addPatient = (entry) => {
    const newPatient = Object.assign({ id: uuid_1.default.v1() }, entry);
    patients_1.default.push(newPatient);
    return newPatient;
};
exports.default = { getNonSensitiveEntries, addPatient };
