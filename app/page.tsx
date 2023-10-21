'use client'

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { historyField } from '@codemirror/commands';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import Button from '@mui/material/Button';

const stateFields = { history: historyField };
const languages = [
  {label: "JavaScript", value: "javascript"},
  {label: "Ruby", value: "ruby"}
]

export default function Home() {
  const serializedState = localStorage.getItem('myEditorState');
  const prevCode = localStorage.getItem('prevCode') || '';
  
  const [lang, setLang] = useState(languages[0])
  const [code, setCode] = useState(prevCode)

  function handleChange(e: SelectChangeEvent){
    const selectedLang = languages.find(l => l.value === e.target.value)
    if (selectedLang) setLang(selectedLang)
  }

  async function handleCodeSubmit(){
    console.log(code);
    console.log(lang.value)
    const request = await fetch("/api/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({code , lang: lang.value})
    })
    const data = await request.json()
    console.log(data)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Select
          className='mb-3'
          value={lang.value}
          label="Age"
          onChange={handleChange}
        >
          {languages.map((l) => {
            return(
              <MenuItem key={l.label} value={l.value}>{l.label}</MenuItem>
            )}
          )}
        </Select>
        <CodeMirror
          value={code}
          height="50vh"
          width='500px'
          theme={okaidia}
          initialState={
            serializedState
              ? {
                  json: JSON.parse(serializedState || ''),
                  fields: stateFields,
                }
              : undefined
          }
          onChange={(value, viewUpdate) => {
            localStorage.setItem('prevCode', value);
            setCode(value)
            const state = viewUpdate.state.toJSON(stateFields);
            localStorage.setItem('myEditorState', JSON.stringify(state));
          }}
        />
        <Button
          variant="contained"
          className="mt-5"
          onClick={handleCodeSubmit}
        >
          Submit
        </Button>
      </div>
    </main>
  )
}
