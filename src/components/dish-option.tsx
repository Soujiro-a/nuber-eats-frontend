import React from "react";
import { restaurantPageQuery_restaurant_restaurant_menu_options_choices } from "../api/restaurantPageQuery";

interface IDishOptionProps {
  isOptionSelected?: boolean;
  isChoiceSelected: (dishId: number, choiceName: string) => boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
  choices:
    | restaurantPageQuery_restaurant_restaurant_menu_options_choices[]
    | null;
  addChoiceToOption: (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => void;
  removeChoiceFromOption: (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => void;
}
export const DishOption: React.FC<IDishOptionProps> = ({
  isOptionSelected,
  isChoiceSelected,
  name,
  extra,
  dishId,
  addOptionToItem,
  removeOptionFromItem,
  choices,
  addChoiceToOption,
  removeChoiceFromOption,
}) => {
  const onOptionClick = () => {
    if (isOptionSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  const onChoiceClick = (choiceName: string) => {
    if (isChoiceSelected(dishId, choiceName)) {
      removeChoiceFromOption(dishId, name, choiceName);
    } else {
      addChoiceToOption(dishId, name, choiceName);
    }
  };
  return (
    <div>
      <span
        onClick={onOptionClick}
        className={`flex items-center border ${
          isOptionSelected ? "border-gray-800" : ""
        }`}
      >
        <h6 className="mr-2">{name}</h6>
        {extra !== 0 && <h6 className="text-sm opacity-75">{`(₩${extra})`}</h6>}
      </span>
      {choices &&
        choices.length !== 0 &&
        choices.map((choice, index) => (
          <span
            onClick={() => onChoiceClick(choice.name)}
            key={index}
            className={`flex items-center ml-4 my-1 border ${
              isChoiceSelected(dishId, choice.name) ? "border-gray-800" : ""
            }`}
          >
            <h6 className="text-sm mr-2">{choice.name}</h6>
            <h6 className="text-xs opacity-75">{`(₩${choice.extra})`}</h6>
          </span>
        ))}
    </div>
  );
};
