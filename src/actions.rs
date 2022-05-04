use wasm_bindgen::prelude::*;
use serde::{Deserialize};

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ActionType {
    AddName,
    UpdateName,
}

#[derive(Deserialize)]
pub struct AddNameAction {
    // pub id: u32,
    pub first_name: String,
}

#[derive(Deserialize)]
pub struct UpdateNameAction {
    pub id: u32,
    pub first_name: String,
}