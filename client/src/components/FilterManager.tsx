import React, {useEffect, useState} from 'react';
import "../styles/TableManager.scss";
import MySelect from "./UI/MySelect";
import MyInput from "./UI/MyInput";
import {FILTER_CONDITIONS, FILTER_FIELDS} from "../store/constants";
import {useTypeSelector} from "../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {setFilteredItemsActionCreator} from "../store/actionCreators/items";
import {ItemKeys} from "../types";

const FilterManager = () => {
    const allItems = useTypeSelector(state => state.items.allItems);
    const [filterField, setFilterField] = useState<string>(Object.keys(FILTER_FIELDS)[0]);
    const [filterCondition, setFilterCondition] = useState<string>(Object.keys(FILTER_CONDITIONS)[0]);
    const [filterValue, setFilterValue] = useState<string>("");

    const dispatch = useDispatch();

    // Здесь находится вся логика фильтрации
    useEffect(() => {
        let itemsToShow = allItems;

        if (filterValue == "") {
            dispatch(setFilteredItemsActionCreator(itemsToShow));
            return;
        }

        // TODO: "more" and "less" filtering by date
        // TODO: get rid of "@ts-ignore"
        switch (filterCondition) {
            case "equal":
                // @ts-ignore
                itemsToShow = allItems.filter((item) => String(item[filterField]) === filterValue)
                break;

            case "contains":
                // @ts-ignore
                itemsToShow = allItems.filter((item) => String(item[filterField]).includes(filterValue))
                break;

            case "more":
                if (filterField === ItemKeys.distance || filterField === ItemKeys.quantity){
                    if (isNaN(Number(filterValue))){
                        itemsToShow = [];
                        break;
                    }

                    itemsToShow = allItems.filter((item) => item[filterField] > Number(filterValue))
                    break;
                }

                // @ts-ignore
                itemsToShow = allItems.filter((item) => item[filterField] > filterValue);
                break;

            case "less":
                if (filterField === ItemKeys.distance || filterField === ItemKeys.quantity){
                    if (isNaN(Number(filterValue))){
                        itemsToShow = [];
                        break;
                    }

                    itemsToShow = allItems.filter((item) => item[filterField] < Number(filterValue))
                    break;
                }

                // @ts-ignore
                itemsToShow = allItems.filter((item) => item[filterField] < filterValue);
                break;
        }

        dispatch(setFilteredItemsActionCreator(itemsToShow));
    }, [allItems, filterField, filterCondition, filterValue])

    return (
        <div className="TableManager">
            <MySelect
                title="Поле"
                data={FILTER_FIELDS}
                value={filterField}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilterField(event.target.value)}
            />
            <MySelect
                title="Условие"
                data={FILTER_CONDITIONS}
                value={filterCondition}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilterCondition(event.target.value)}
            />
            <MyInput
                title="Значение"
                value={filterValue}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilterValue(event.target.value)}
            />
        </div>
    );
};

export default FilterManager;