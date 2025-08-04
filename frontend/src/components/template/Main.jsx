import './Main.css';
import React from 'react';


const Main = (props) => (
  <>
    <main className='ma'>
      <div className="p-3 mt-3">
        {props.children}
      </div>
    </main>

  </>
);

export default Main;