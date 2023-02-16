export default function PlugView({ name, amount }) {
    const plugMap = {
        "5-20R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_20A_GFCI_Outlet.png?v=1612382967",
            name: "120v 20 Amp Standard Receptacle"
        },
        "L5-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_30A_Twist_Lock.png?v=1612382967",
            name: "120v 30 Amp Twist Lock"
        },
        "L14-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_30A_Twist_Lock.png?v=1612382967",
            name: "120/240v 30 Amp Twist Lock"
        },
        "L14-50R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_50A_Heavy_Duty_Outlet.png?v=1612382967",
            name: "120v/240v 50 Amp Heavy Duty Outlet (L14-50R)"
        },
        "14-50R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_50A_Heavy_Duty_Outlet.png?v=1612382967",
            name: "120v/240v 50 Amp Heavy Duty Outlet (14-50R)"
        },
        "TT-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_TT-30R.png?v=1612813988",
            name: "120v 30 Amp RV Ready"
        },
        "L14-20R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/125V_250V_20_Amp_Twist_Lock.png?v=1613276582",
            name: "125v/250v 20 Amp Twist Lock"
        }
    }
    return (
        <div className="pdp__description__plugs__row">
            <div className="pdp__description__plugs__row__container">
                <div className="pdp__description__plugs__row__container__image-container">
                    <img className="pdp__description__plugs__row__container__image-container__img" src={plugMap[name] && plugMap[name].image_url} alt="checkmark" width="auto" height="auto" loading="lazy"/>
                </div>
                <p className="pdp__description__plugs__row__container__text">&times;{amount}</p>
            </div>
            <div className="pdp__description__plugs__row__details">
                <p className="pdp__description__plugs__row__details__name">{plugMap[name] && plugMap[name].name}</p>
                <p className="pdp__description__plugs__row__details__type">({name})</p>
            </div>
        </div>
    )
}