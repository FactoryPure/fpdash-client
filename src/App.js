import './App.css';
import { useEffect } from 'react';
import LayoutLogin from './layout/LayoutLogin';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setUser } from './redux/user';
import { useDispatch, useSelector } from 'react-redux';
import Router from './routes/Router';
import Layout from './layout/Layout';
import SUBMENUS from './routes/submenus';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state)
  const sessionToken = sessionStorage.getItem("session_token")
  const location = useLocation()
  const currentLocation = location.pathname.split("/")[1].replaceAll("-", " ")
  useEffect(() => {
    if (sessionToken) {
      fetch("https://api.fpdash.com/users/verify", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionToken
        }      
      }).then(res => res.json()).then(res => {
        if (res.success) {
          sessionStorage.setItem("session_token", res.token)
          dispatch(setUser({
            firstName: res.first_name,
            lastName: res.last_name,
            email: res.email,
            type: res.type,
            access: JSON.parse(res.access)
          }))
        } else {
          navigate("/login")
        }
      }).catch(err => {
        navigate("/login")
      })
    } else if (location.pathname !== "/create") {
      navigate("/login")
    }
  }, [])
  return (
    <>
      {(location.pathname === "/create" || location.pathname === "/login") ? (
        <LayoutLogin>
          <Router />
        </LayoutLogin>
      )
      :
      (
        <>
          {user && 
            <Layout title={currentLocation} access={user.access} submenu={SUBMENUS[currentLocation]}>
              <Router />
            </Layout>
          }
        </>
      )
      } 
    </>
  );
}

export default App;