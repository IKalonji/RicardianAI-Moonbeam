import React, { useRef,useEffect, useState } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { SplitButton } from 'primereact/splitbutton';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import { AppStateService } from '../AppstateService/AppState.service';

//Main Navbar here
function Navbar() {

  let [toolbarOptions, settoolbarOptions] = useState(
    (
      <>
        <Button label="Connect Metamask Wallet" className="mr-2" onClick={() => {NavigateToPage("/")}} />
      </>
    )
  )
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  const service = new AppStateService();
  
  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted, and may now proceed to staking', life: 4000 });
    NavigateToPage("/joinDao")
  }

  const reject = () => {
      toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  let items = [
    {
      label: 'Pending Projects',
      icon: 'pi pi-external-link',
      command: () => {
        if (service.isUserMemeber === true){
          console.log("the user is a member")
          NavigateToPage("/member/view-projects")
        }
        else{
          console.log("It is false the user is not a member");
          setVisible(true)
          
        }
        
      }
    },
    {
      label: 'Join DAO',
      icon: 'pi pi-refresh',
      command: () => {
        NavigateToPage("/joinDao");
      }
    },
  ];

  let startContent = (
    <a className="p-button-text" style={{ cursor: "pointer" }} onClick={() => {navigate("/")}}>
      <Button severity="secondary" text>
      {/* <i className='pi pi-building' style={{ fontSize: '2rem' }}></i> */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-2rem">
          <path
            d="M12 0C5.383 0 0 5.383 0 12c0 6.617 5.383 12 12 12s12-5.383 12-12c0-6.617-5.383-12-12-12zm0 22.737c-6.132 0-11.106-4.973-11.106-11.106C.894 5.5 5.868.526 12 .526s11.106 4.973 11.106 11.105c0 6.133-4.974 11.106-11.106 11.106zm-.63-6.16l-1.247-1.1c.998-1.498 1.636-3.262 1.636-5.23 0-2.86-1.577-4.437-4.437-4.437-2.861 0-4.438 1.577-4.438 4.437 0 2.87 1.577 4.448 4.438 4.448 1.103 0 2.132-.305 3.02-.854l1.348 1.247c-1.34.817-2.94 1.302-4.73 1.302-4.965 0-8.975-4.01-8.975-8.975C2.024 4.01 6.034 0 11 0s8.975 4.01 8.975 8.975c0 4.38-3.228 8.048-7.448 8.778z"
            fill="#808080"
          />
        </svg>
      <label>
        Riccardin AI
      </label>
      </Button>

    </a>
  );

  const eventRaised = () => {
    console.log("EVENT RAISED");
    settoolbarOptions(
      (
        <>
          <Button label="Create new" icon="pi pi-plus" className="mr-2" onClick={() => {NavigateToPage("/crete-new-contract")}} text/>
          {/* <Button label="Go to contract" icon="pi pi-file" className="mr-2" onClick={() => {NavigateToPage("/interact-with-contract")}} text /> */}
          <Button label="Interact with contract" icon="pi pi-arrow-right-arrow-left" className="mr-2" onClick={() => {NavigateToPage("/interact-with-contract")}} text />
          {/* <SplitButton label="DAO Members" icon="pi pi-view" model={items} className="mr-2" text severity='success'></SplitButton> */}
        </>
      )
    )
  }

  useEffect(() => {
    window.addEventListener('loggedIn', eventRaised);
    return () => {
      window.removeEventListener('loggedIn', eventRaised);
    };
  }, []);

  function NavigateToPage(path) {
    if (service.connected) {
      navigate(path)
    } else {
      service.connectToMetamask()
        .then(() => {
          navigate(path);
          toast.current.show({ severity: 'success', summary: 'Connected', detail: `'Successfully connected to wallet'`, life: 3000 });
        })
        .catch((error) => {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Cannot display the page until user is connected to Metamask', life: 3000 });
        });
    }
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="In order to view the projects pending approval you need to be a DAO member. Click the yes button to stake and become a member" 
        header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
        <Toolbar start={startContent} end={toolbarOptions} />
    </div>
  );
}

export default Navbar;