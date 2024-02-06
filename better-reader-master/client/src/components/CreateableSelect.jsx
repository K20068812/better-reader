import { useState } from "react";
import Select from "react-select";
import { capitalizeFirstLetter } from "../CONSTANT";
import Creatable from "react-select/creatable";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#4B5563" : "#E2E8F0",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(75, 85, 99, 0.2)" : "none",
    "&:hover": {
      borderColor: "#4B5563",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#4B5563" : "transparent",
    color: state.isSelected ? "#FFFFFF" : "#374151",
    "&:hover": {
      backgroundColor: "#E5E7EB",
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "0px",
    boxShadow: "none",
    borderRadius: "none",
    // backgroundColor: "black",
  }),
};

const CreateableSelect = (props) => {
  let options = [];
  options = [
    ...props.options.map((a, b) => {
      return {
        value: a.id,
        label: a.title,
      };
    }),
  ];

  return (
    <div className={props.className}>
      <Creatable
        styles={customStyles}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:rounded-lg focus:rounded-lg  block w-full p-2.50`}
        classNamePrefix="select"
        value={props.defaultValue}
        onChange={(e) => {
          props.setShelf(e);
        }}
        options={options}
        name={props.name}
        placeholder={`Select Shelf`}
        isSearchable={true}
        onCreateOption={props.onCreateOption}
      />
    </div>
  );
};

export default CreateableSelect;
