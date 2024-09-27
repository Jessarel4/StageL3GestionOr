import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const Not404 = () => {
  return (
    <div className='fullscreen-result'>
      <Result
          status="404"
          title="404"
          subTitle="Désolé, la page que vous avez visitée n'existe pas."
          extra={
            <Link to="/" >
              <Button type="primary">Retour à l'accueil</Button>
            </Link>
        }
      />
    </div>
  );
}

export default Not404;
