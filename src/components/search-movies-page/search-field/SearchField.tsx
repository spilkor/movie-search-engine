import React, { useEffect, useRef, useState} from 'react';
import {Key} from "ts-keycode-enum";
import './search-field.css';

export interface SearchFieldProps {
  search: (query: string) => void
}

export function SearchField({search} : SearchFieldProps) {

  const [text, _setText] = useState("");
  const textRef = useRef(text);
  const setText = (text: string) => {
    textRef.current = text;
    _setText(text);
  };

  function _search() {
    if (textRef.current){
      search(textRef.current);
    }
  }

  const keyUpListener = (event: KeyboardEvent) => {
    event.keyCode === Key.Enter && _search()
  };

  useEffect(() => {
    window.addEventListener('keyup', keyUpListener);
    return () => {
      window.removeEventListener('keyup', keyUpListener);
    };
  }, []);

  return (
      <div className={"search-field"}>
        <input className={"search-input"}
               type='text'
               autoFocus={true}
               value={textRef.current}
               onChange={e => setText(e.target.value)}
               onClick={(e)=> e.stopPropagation()}
        />
        <div className={"app-button"}
             onClick={() => _search()}>
          Search
        </div>
      </div>
  );

}

