import '../assets/css/login.css';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';

const Login = () => {
  return (
    <div className='wrap'>
      {/* 메뉴 */}
      <div className="menu">
        {/* 로고 */}
        <div className="logo">
          <img src={Logo_US} className="logo_us" alt="Logo US" />
          <img src={Logo_EARTH} className="logo_earth" alt="Logo Earth" />
        </div>
        {/* 버튼 */}
        <div className="button">
          <div className="btn" id="home">HOME</div>
          <div className="btn" id="diary">DIARY</div>
          <div className="btn" id="map">MAP</div>
          <div className="btn" id="profile">PROFILE</div>
          <div className="btn" id="alarm">
            <img src={alarm_white} className="alarm_white" alt="Alarm White" />
            <img src={alarm_black} className="alarm_black" alt="Alarm Black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;