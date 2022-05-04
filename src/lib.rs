#[macro_use]
extern crate serde_derive;
extern crate js_sys;

mod actions;
mod utils;

use std::str::FromStr;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::sync::atomic::{AtomicI32, AtomicUsize, Ordering};
use lazy_static::lazy_static;
use std::sync::Mutex;
use actions::{ActionType, AddNameAction, UpdateNameAction};

static SUM: AtomicI32 = AtomicI32::new(0);
static J: AtomicUsize = AtomicUsize::new(0);

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
pub struct Name {
    pub id: u32,
    first_name: String,
}

impl Name {
    pub fn new(id: u32, first_name: String) -> Name {
        Name { id, first_name }
    }
}

#[derive(Serialize, Clone)]
struct State {
    names: Vec<Name>,
}

impl State {
    fn new(names: Vec<Name>) -> State {
        State { names }
    }
}

#[wasm_bindgen]
pub struct Store {
    // listeners: Vec<&js_sys::Function>,
    // prev_states: Vec<State>,
    state: State,
}

#[wasm_bindgen]
impl Store {
    pub fn new() -> Store {
        utils::set_panic_hook();

        let mut names = Vec::new();
        let name1 = Name::new(1, "Marcus".to_string());
        let name2 = Name::new(2, "Gregor".to_string());
        let name3 = Name::new(3, "Rishitha".to_string());
        names.push(name1);
        names.push(name2);
        names.push(name3);

        Store {
            // listeners: Vec::new(),
            // prev_states: Vec::new(),
            state: State::new(names),
        }
    }
}

#[wasm_bindgen]
impl Store {
    pub fn get_state(&self) -> JsValue {
        utils::set_panic_hook();
        JsValue::from_serde(&self.state).unwrap()
    }

    // pub fn subscribe(&mut self, f: &js_sys::Function) {
    //     self.listeners.push(f);
    // }

    pub fn dispatch(&mut self, action_type: ActionType, action: &JsValue) {
        utils::set_panic_hook();
        // Get the new state
        let new_state: State = match action_type {
            ActionType::AddName => self.add_name(action),
            ActionType::UpdateName => self.update_name(action),
        };

        log(&serde_json::to_string(&new_state).unwrap());

        // Update the states in the store itself
        // self.prev_states.push(self.state.clone());
        self.state = new_state;

        log(&serde_json::to_string(&self.state).unwrap());

        // TODO: wasm-bindgen currently does not allow the wasm_bindgen trait for generic structs
        //       reimplement this when it does
        // Inform any subscribers
        // for listener in &self.listeners {
        //     let this = JsValue::NULL;
        //     log("Calling listener");
        //     match listener.call0(&this) {
        //         Ok(_) => log("Ok"),
        //         Err(e) => log("Err"),
        //     }
        // }
    }

    fn add_name(&self, action: &JsValue) -> State {
        log("Calling add_name");
        utils::set_panic_hook();
        let action: AddNameAction = action.into_serde().unwrap();
        let mut names: Vec<Name> = self.state.names.clone();
        let id = (names.len() + 1) as u32;
        let name: Name = Name::new(id, action.first_name);
        names.push(name);
        State::new(names)
    }

    fn update_name(&self, action: &JsValue) -> State {
        utils::set_panic_hook();
        let action: UpdateNameAction = action.into_serde().unwrap();
        let names: Vec<Name> = self.state.names.iter()
            .map(|name| {
                if name.id == action.id {
                    Name::new(name.id, name.first_name.clone())
                } else {
                    name.clone()
                }
            })
            .collect();
        State::new(names)
    }

    fn get_names(&self) -> Vec<Name> {
        utils::set_panic_hook();
        self.state.names.clone()
    }

    pub fn get_name_next(&self) -> String {
        utils::set_panic_hook();
        let length = self.get_names().len();
        let names = self.get_names();

        J.fetch_add(1, Ordering::SeqCst);
        let j = J.load(Ordering::SeqCst);

        if j > length - 1 {
            J.store(length - 1, Ordering::SeqCst);
        }

        let k = J.load(Ordering::SeqCst);

        names.get(k).unwrap().clone().first_name
    }

    pub fn get_name_previous(&self) -> String {
        utils::set_panic_hook();
        let names = self.get_names();

        let j = J.load(Ordering::SeqCst);
        if j > 0 {
            J.fetch_sub(1, Ordering::SeqCst);
        }
        let k = J.load(Ordering::SeqCst);

        names.get(k).unwrap().clone().first_name
    }
}

#[wasm_bindgen]
pub fn get_state() -> JsValue {
    utils::set_panic_hook();
    let store = Store::new();
    Store::get_state(&store)
}

