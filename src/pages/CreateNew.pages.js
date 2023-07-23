import React, { useState, useRef} from "react";
// import dotenv from "dotenv"
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Editor } from "primereact/editor";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

const CreateNew = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cancontinue, setCanContinue] = useState(false)
    const toast = useRef(null);
    const [editorText, setEditorText] = useState('');
    const navigate = useNavigate()

    const ConvertToSmartContract = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role:"user", content:`You are an experienced Solidity Smart Contract Engineer, with extensive experience of converting legal agreements into Solidity smart contracts to be used as Ricardian contracts. Using the legal agreement below, generate a Solidity smart contract that will represent the legal agreement on the blockchain, create functions in the smart contract that represents the conditions of the legal agreement. You are only required to generate the code without any explanation, you may only add comments to the code. Here is the agreement: ${editorText} create a Solidity smart contract based on this. You are required to also provide the logic within the functions to support the contract. Do not add placeholders, add the function logic. Comments should be kept to a minimum.` })
        };
        fetch('https://jointlabs.xyz/v1/ricardian', requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("response: ", data.response);
            
            localStorage.setItem("GeneratedContract", data.response);
            
            setLoading(false); // Set loading state to false after fetch is done
          });
      };

      const footerContent = (
        <div>
          {
            !cancontinue ?(
              <Button label="Save" icon="pi pi-arrow-circle-right" onClick={() => { setCanContinue(true); setLoading(true) }} raised/>
            ):
          loading ? (
            <div className="p-d-flex p-ai-center p-jc-center">
              <i className="pi pi-spin pi-spinner text-blue-500" style={{ fontSize: '2rem', marginRight: '0.5rem' }}></i>
              <span>Your smart contract is on the way...</span>
            </div>
          ) : !loading ? (
            <Button label="Continue" icon="pi pi-arrow-circle-right" onClick={() => {localStorage.setItem("Contract", `${editorText}`); setVisible(false); navigate("/start-deployement") }} text raised autoFocus />
          ) :(
            <Button label="Continue" icon="pi pi-arrow-circle-right" onClick={() => {localStorage.setItem("Contract", `${editorText}`); setVisible(false); navigate("/start-deployement") }} text raised autoFocus />
          )}
        </div>
      );

    const renderHeader = () => {
        return (
          <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
          </span>
        );
      };

      const reviewHeader = () => {
        return (
          <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
          </span>
        );
      };
      const header = renderHeader();
      const review = reviewHeader();

      const CheckEditorcontent = async (event) => {
        if (!editorText){
            console.log("editor is not filled");
            toast.current.show({ severity: 'warn', summary: 'Field not filled in', detail: "please fill in the prompt." });
        }else {
            ConvertToSmartContract()
            setVisible(true)
            localStorage.setItem("Contract", `${editorText}`);       
            // localStorage.setItem("GeneratedContract", `${contractText}`)     
        }
      }
      
    return (
        <div>

          <div style={{height:"25px"}}> </div>
          <Toast ref={toast}></Toast>

          <Dialog header="Click continue to deploy your contract when the button is enabled" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
            <pre>
              <Editor value={editorText} onTextChange={(e) => {setEditorText(e.textValue)}} headerTemplate={review} style={{ height: '320px' }}/>
            </pre>
          </Dialog>

          <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="https://blocks.primereact.org/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Enter the Human readable Contract below</div>
                </div>

                <div>
                    <div className="spacer" style={{height:"20px"}}></div>
                    <Editor value={editorText} onTextChange={(e) => { setEditorText(e.textValue) }} headerTemplate={header} style={{ height: '320px' }} />
                    <div className="spacer" style={{height:"20px"}}></div>
                    <Button label="Save and review" icon="pi pi-cloud-upload" className="w-full"  onClick={CheckEditorcontent}/>
                 </div>
            </div>
        </div>
        </div>
      );
      
}

export default CreateNew