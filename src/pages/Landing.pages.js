import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import Divider from '@mui/material/Divider';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { ConfirmDialog} from 'primereact/confirmdialog';
import { AppStateService } from '../AppstateService/AppState.service';


const Landingpage = () => {
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const service = new AppStateService();

  function GetStartedEvent(path) {
    if (service.connected) {
      navigate('/crete-new-contract')
    } else {
      service.connectToMetamask()
        .then(() => {
          navigate('/crete-new-contract');
        })
        .catch((error) => {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Cannot display the page until user is connected to flow', life: 3000 });
        });
    }
  }


  const footerContent = (
    <div>
      <Button label="Close" icon="pi pi-times" severity="danger" onClick={() => setVisible(false)} className="p-button-text" />
    </div>
  );

  return (
    <div>
        <Toast ref={toast}/>
      <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
          <section>
            {/* <Toast ref={toast} /> */}
            <ConfirmDialog />
            <span className="block text-6xl font-bold mb-1">RicardianAI</span>
            <div className="text-6xl text-primary font-bold mb-3">Legally Binding Smart Contracts</div>
            <p className="mt-0 mb-4 text-700 line-height-3">Ricardian AI converts ordinary legal contracts into smart contracts and enforces them using AI technology.</p>

            <Button label="Get started" type="button" className="mr-3 p-button-raised" onClick={GetStartedEvent}/>
            <Button label="Watch Demo" type="button" className="p-button-outlined" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog draggable={false} visible={visible} style={{ width: '50vw', textAlign: "center" }} onHide={() => setVisible(false)} footer={footerContent}>
              <iframe src='https://www.youtube.com/embed/I7VrJbyu7M0' title="The demo video" width="500" height="400"></iframe>
            </Dialog>
          </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden">
          <img src="https://appdevelopermagazine.com/scripts/resize/?path=/multimedia/Using-smart-contracts-to-improve-data-management_tbo7l3y0.jpg&width=600" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
        </div>
      </div>

      <Divider variant="middle" />
      <div style={{ height: "22px" }}></div>

      <div className="surface-0 text-center">
        <div className="mb-3 font-bold text-3xl">
          <span className="text-900">Bringing, </span>
          <span className="text-blue-600">The AI into blockchain</span>
        </div>
        <div className="text-700 mb-6">RicardianAI makes it easy to leagally bind smartcontract's</div>
        <div className="grid">
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-desktop text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Simple UI</div>
            <span className="text-700 line-height-3">Ricardian AI has a very clean and easy-to-use user interface.</span>
          </div>
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-lock text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Security</div>
            <span className="text-700 line-height-3">All contract on the website are secure</span>
          </div>
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-check-circle text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Easy to Use</div>
            <span className="text-700 line-height-3">With our simple UI, users can navigate through the application easily.</span>
          </div>
            <div className="col-12 md:col-4 mb-4 px-5">
                <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                    <i className="pi pi-globe text-4xl text-blue-500"></i>
                </span>
                <div className="text-900 text-xl mb-3 font-medium">Fast & Global Support</div>
                <span className="text-700 line-height-3">RicardianAI is open to users around the globe</span>
            </div>
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-github text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Open Source</div>
            <span className="text-700 line-height-3">Ricardian AI is an open source project. Feel free to check out the GitHub Repository.</span>
          </div>
          <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-shield text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Trusted Security</div>
            <span className="text-700 line-height-3">Ricardian AI is secure and trustworthy.</span>
          </div>
        </div>
      </div>

      <Divider />
      <div style={{ height: "22px" }}></div>

      <div className="surface-0 text-700 text-center">
        <div className="text-blue-600 font-bold mb-3"><i className="pi pi-github"></i>&nbsp;POWERED BY GITHUB</div>
        <div className="text-900 font-bold text-5xl mb-3">Feel free and view the code on Github</div>
        <div className="text-700 text-2xl mb-5">Ricardian AI's codebase is open source. Click the button below and go check it out.</div>
        <a href='https://github.com/IKalonji/RiccardianAI' target='_blank' rel='noopener noreferrer'>
          <Button label="View the Repo" icon="pi pi-github" className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap" />
        </a>
      </div>
    </div>
  );
};

export default Landingpage;