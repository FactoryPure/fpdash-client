import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setSections } from "../../redux/sections"

export default function CrossSellsScreen() {
    const [allProducts, setAllProducts] = useState([])
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const debouncedSearch = useDebounce(search, 200)
    const sessionToken = sessionStorage.getItem("session_token")
    function useDebounce(value, delay) {
        // State and setters for debounced value
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(
          () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
              setDebouncedValue(value);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
              clearTimeout(handler);
            };
          },
          [value, delay] // Only re-call effect if value or delay changes
        );
        return debouncedValue;
      }
    const { crossSells } = useSelector(state => state).sections
    const dispatch = useDispatch()
    const addCrossSell = (gid) => {
        dispatch(setSections({
            crossSells: [
                ...crossSells,
                gid
            ]
        }))
    }
    const removeCrossSell = (gid) => {
        dispatch(setSections({
            crossSells: [
                ...crossSells.filter(cs => cs !== gid),
            ]
        }))
    }
    useEffect(() => {
        if (allProducts.length > 0) {
            setFiltered(allProducts.filter(p => p.title.toLowerCase().includes(debouncedSearch.toLowerCase())))
        }
    }, [debouncedSearch])
    useEffect(() => {
        fetch("http://localhost:8080/products?fields=title,gid,img_src", {
            headers: { Authorization: sessionToken }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setAllProducts(res.products)
                setFiltered(res.products)
            }
        })
    }, [])
    return (
        <>
            {allProducts.length > 0 && (
                <div className="cross-sells__parent">
                    <div className="cross-sells__half cross-sells__remove">
                        <h3>Added</h3>
                        <div className="cross-sells__box">
                            {crossSells.map(p => {
                                const match = allProducts.find(product => product.gid === p)
                                if (match) {
                                    return (
                                        <div key={match.gid + "-added"} className="cross-sells__item" data-gid={match.gid} onClick={() => removeCrossSell(match.gid)}>
                                            <img
                                                height="50"
                                                width="50"
                                                style={{objectFit: 'contain'}}
                                                src={match.img_src}
                                                loading="lazy"
                                            />
                                            {match.title}
                                        </div>
                                    )
                                } else {
                                    console.log(p)
                                }
                            })}
                        </div>
                    </div>
                    <div className="cross-sells__half cross-sells__add">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <h3>All Products</h3>
                            <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="search" />
                        </div>
                        <div className="cross-sells__box">
                            {filtered.filter(p => !crossSells.includes(p.gid)).map(p => <div key={p.gid + "-all"} className="cross-sells__item" data-gid={p.gid} onClick={() => addCrossSell(p.gid)}>
                                <img
                                    height="50"
                                    width="50"
                                    style={{objectFit: 'contain'}}
                                    src={p.img_src}
                                    loading="lazy"
                                />
                                {p.title}
                            </div>)}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}