import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';

import Confetti from 'react-confetti';
import { Button } from 'primereact/button';
import { Editor } from "primereact/editor";
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AppStateService } from '../AppstateService/AppState.service';
import { InputText } from 'primereact/inputtext';

const Deploy = () => {
  const toast = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [visible, setVisible] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [renderState, setRenderState] = useState(null);
  const [argument, setArgument] = useState('')
  const [status, setStatus] = useState("");
  const [contractName, setContractName] = useState('');
  let argsArray = []

  const contract = localStorage.getItem("Contract");
  const generatedContract = localStorage.getItem("GeneratedContract");

  const navigate = useNavigate()
  const service = new AppStateService();

  useEffect(() => {
    if (deploying) {
      FetchingBeforeDeployment();
    }
    }, [deploying]);

    async function FetchingBeforeDeployment(){

      const compileContract = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: contractName, contract: generatedContract}) //TODO: 
      };

      console.info("compiled Contract: ", compileContract);

      try {
        console.log("compiling contract")
  
        let contractDeployment = await fetch("https://cbcompile.onrender.com/compile", compileContract)
        .then((response) => response.json())
        .then(async (data) => {
          console.log("response: ", data);
          if ("errors" in data){
            console.log("contract compiled")
            toast.current.show({ severity: 'error', summary: 'Warning', detail: "An error occured during the deployement of the contract" , life:17000});
          } 
          else{
            setStatus("Deployment started");
            toast.current.show({ severity: 'success', summary: 'Success', detail: "Your Ricardian contract has been successfully deployed" , life:5000});
            console.log("data: ", data)
            let contractFactory = new ethers.ContractFactory(data.abi, data.bytecode, service.signer);
            let _contract;

            if (argsArray.length === 0){
              _contract = await contractFactory.deploy().then((data) => {
                console.log(data);
              }).catch((error) => {
                console.log("error: ",error);
              })
              

            }
            else{
              _contract = await contractFactory.deploy(argsArray).then((data) => {
                console.log("data: ",data);
                toast.current.show({ severity: 'success', summary: 'Success', detail: "Your Ricardian contract has been successfully deployed\n"+data  , life:5000});
              }).catch((error) => {
                console.log("error: ",error);
                toast.current.show({ severity: 'error', summary: 'Warning', detail: error , life:17000});
              })
              setActiveIndex(2);
              setRenderState('Deploying' )
            }
            setActiveIndex(2);
            setRenderState('Deploying' )
          }
        })
        
      } catch (error) {
        console.log(error);
      }
  }

  const renderRiccardianContractHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-code" aria-label="code"></button>
      </span>
    );
  };

  const renderHumanReadableContractHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const RiccardianHeader = renderRiccardianContractHeader();
  const HumanReadableHeader = renderHumanReadableContractHeader();

  

  const ContractsStep = () => {
    return (
      <div className='grid'>
        <div style={{ height: 335 }}></div>

        <div className="">
          <div className="grid">

            <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            
                <div className="col-12 surface-card p-3  border-round w-full lg:w-5">
                  <div className="p-3 h-full">
                    <div className=" shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                      <div className="text-center text-900 font-medium text-xl mb-2">Your input contract</div>
                      <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                      <pre>
                        <Editor headerTemplate={HumanReadableHeader} value={contract} readOnly style={{ height: '320px' }} />
                      </pre>
                      <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    </div>
                  </div>
                </div>

              <div className="col-12 surface-card p-3 border-round w-full lg:w-5">
                <div className="p-3 h-full">
                  <div className="shadow-2 p-3 flex flex-column" style={{ borderRadius: '6px' }}>
                    <div className="text-center text-900 font-medium text-xl mb-2">AI Generated Riccardian contract</div>
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <pre>
                      <code>
                        <Editor headerTemplate={RiccardianHeader} value={generatedContract} style={{ height: '320px' }} />
                      </code>
                    </pre>
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div style={{ height: "40px" }}></div>
        <Button
          style={{ position: "relative", top: "40vh" }}
          label="Next Step"
          icon="pi pi-plus"
          className="w-full "
          onClick={() => {
            setActiveIndex(1);
            setRenderState("Deploying");
            localStorage.setItem("GeneratedContract", generatedContract)
          }} />
      </div>
    );
  };

  const DeployingStep = () => {
    console.log("second step");

    const handleButtonClick = () => {
      if (!argument){
        toast.current.show({ severity: 'info', summary: 'Arguments empty', detail: `array: ${argsArray}` , life:5000});
        setDeploying(true);

      }else {
        let splitValues = argument.split(",")

        splitValues.forEach(element => {
          argsArray.push(element.trim())      
        });
        toast.current.show({ severity: 'info', summary: 'Arguments set', detail: `array: ${argsArray}` , life:5000});
        setDeploying(true);
      }
    };

    return (
      <div className='flex flex-column'>
        
        <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
          <Button
            label="Start deploying"
            className="mr-2"
            onClick={handleButtonClick}
            text
            raised/>
          </div>

      </div>
    );
  };

  const DoneStep = () => {
    setShowConfetti(true);
    return (
      <div>
        <div className="flex flex-column">
          <div className="flex align-items-center justify-content-center h-4rem  font-bold border-round m-2">
            <div className="text-900 font-medium text-xl mb-2">Well done! You have Successfully deployed a riccardian contract</div>
          </div>

          <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
            <Button
              label="Interact with your smart-contract"
              icon="pi pi-arrow-right-arrow-left"
              className="mr-2"
              onClick={() => {
                navigate("/interact-with-contract");
              }}
              raised />
          </div>
        </div>
      </div>
    );
  };

  const items = [
    {
      label: 'Contracts',
      command: () => {
        setRenderState('Contracts');
        return ContractsStep();
      },
    },
    {
      label: 'Deploying',
      command: () => {
        setRenderState('Deploying');
        return DeployingStep();
      },
    },
    {
      label: 'Done',
      command: () => {
        setShowConfetti(true);
        setRenderState('Done');
        return DoneStep();
      },
    },
  ];

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div>
      <div className="spacer" style={{ height: '20px' }}></div>

      <div className="card">
        <Toast ref={toast}></Toast>
        <Steps
          readOnly={false}
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)} />

        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
        <div className="">
          {activeIndex === 0 && renderState === 'Contracts' ? (
            <ContractsStep />
          ) : activeIndex === 1 && renderState === 'Deploying' ? (
            <>
              
        {deploying ? (
          <>
            <div className='flex flex-column'>
            <div className='flex align-items-center justify-content-center h-4rem font-bold border-round m-2'>
              <div className="text-900 text-3xl font-medium mb-3">Contract being deployed on FlowDE version 1.</div>
              </div>
              <div className='flex align-items-center justify-content-center h-4rem font-bold border-round m-2'>
                <ProgressSpinner style={{ width: '150px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
              </div>
            </div>

            <br />
            <div className="">
              <div className="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">{status}</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-column">
              <div className="flex align-items-center justify-content-center font-bold border-round m-2">

                <div className="text-900 text-2xl font-medium mb-5">
                  Enter the arguments of your smart contract below (seperate arguments with a comma )
                </div>
                
              </div>

              <div className="flex align-items-center justify-content-center font-bold border-round m-2">
              <InputText
                onChange={(e) => {setContractName(e.target.value)}}
                placeholder='Contract Name' 
                rows={5} cols={10} 
                autoFocus 
                style={{width:"45%"}}/>
            </div>

            <div className="flex align-items-center justify-content-center font-bold border-round m-2">
              <InputTextarea
                onChange={(e) => {setArgument(e.target.value)}}
                placeholder='Enter your Arguments here' 
                rows={5} cols={10} 
                autoFocus 
                style={{width:"45%"}}/>
            </div>
            
              
            </div>
          </>
        )}

              <DeployingStep />
            </>
          ) : activeIndex === 2 && renderState === 'Done' ? (
            <DoneStep />
          ) : (
            <ContractsStep />
          )}
        </div>
      </div>
    </div>
  );
};

export default Deploy;