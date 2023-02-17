import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const [currentProduct, setCurrentProduct] = useState("")
    const [loading, setLoading] = useState(false)
    const [settingImage, setSettingImage] = useState(false)
    const dispatch = useDispatch()
    const { product } = useSelector(state => state).sections
    const sessionToken = sessionStorage.getItem("session_token")
    const handleGet = () => {
        setLoading(true)
        dispatch(setSections({
            product: "",
            description: "",
            checkmarks: [],
            plugs: [],
            features: [],
            specifications: { left: [], right: [] },
            packageContents: [],
            warranty: "",
            manuals: []
        }))
        fetch(`http://localhost:8080/descriptions/product/${currentProduct}`, {
            headers: { Authorization: sessionToken }
        }).then(res => res.json()).then(res => {
            if (res) {
                dispatch(setSections({
                    product: {
                        gid: res.gid,
                        title: res.title,
                        img_src: res.img_src
                    },
                    description: res.description,
                    checkmarks: res.checkmarks,
                    plugs: res.plugs,
                    features: res.features,
                    specifications: { left: res.specifications_left, right: res.specifications_right },
                    packageContents: res.package_contents,
                    warranty: res.warranty,
                    manuals: res.manuals,
                    crossSells: res.cross_sells
                }))
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const handleChange = ({ target }) => {
        setCurrentProduct(target.value)
    }
    const handleChangeProduct = () => {
        dispatch(setSections({
            product: "",
            description: "",
            checkmarks: [],
            plugs: [],
            features: [],
            specifications: { left: [], right: [] },
            packageContents: [],
            warranty: "",
            manuals: []
        }))
    }
    const LoadingGear = () => {
        return (
            <svg style={{width: '300px', height: '300px'}} version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 100 100" enable-background="new 0 0 100 100">
                <circle fill="none" stroke="orange" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="48"/>
                <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
                <animateTransform 
                    attributeName="transform" 
                    dur="2s"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    repeatCount="indefinite" />
                </line>
                <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
                <animateTransform 
                    attributeName="transform" 
                    dur="15s"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    repeatCount="indefinite" />
                </line>
            </svg>
        )
    }
    const handleUpload = (e) => {
        setSettingImage(true)
        const data = new FormData()
        data.append("image", e.target.files[0], e.target.files[0].name)
        fetch(`http://localhost:8080/removebg/${product.gid.split("/")[4]}`, {
            method: "POST",
            headers: {
                Authorization: sessionToken
            },
            body: data
        }).then(res => res.json()).then(res => {
            setSettingImage(false)
            if (res.success) {
                dispatch(setSections({
                    product: {
                        ...product,
                        img_src: res.s3_img_url
                    }
                }))
            } else {
                alert("Upload failed! Please make sure that your image is smaller than 10mb.")
                setSettingImage(false)
            }
        }).catch(err => {
            console.log(err)
            alert("Upload failed! Please make sure that your image is smaller than 10mb.")
            setSettingImage(false)
        })
    }
    useEffect(() => {
        if (product && product.gid) {
            setCurrentProduct(product.gid.split("/")[4])
        }
    }, [])
    return (
        <>
            <h2 style={{maxWidth: '600px', margin: '16px auto', textAlign: 'center'}}>{product && product.title}</h2>
            {settingImage ? <LoadingGear /> : product && product.img_src && <img src={product.img_src} width="400" height="400" style={{objectFit: 'contain'}}/>}
            {loading && <LoadingGear />}
            {product && (
                <>
                    <label>{settingImage ? 'Removing background...' : 'Upload new featured image'}</label>
                    <input type="file" name="image_upload" className="image_upload" onChange={handleUpload} />
                </>
            )}
            {(!product && !loading) && <h2 className="productScreen-heading">Find a product</h2>}
            {!product && <input className="product-input" type="text" onChange={handleChange} value={currentProduct} placeholder="Product ID Number"/>}
            {!product ? <button onClick={handleGet}>GET PRODUCT</button> : <button style={{marginTop: '32px'}} onClick={handleChangeProduct}>CHANGE PRODUCT</button>}
        </>
    )
}