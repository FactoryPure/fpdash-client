import { useEffect, useState } from "react"

export default function ScrapeScreen() {
    const [results, setResults] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/scrape/skus/results").then(res => res.json()).then(res => {
            if (res.success) {
                const resultsMap = {}
                for (let result of res.results) {
                    if (!resultsMap[result.sku]) {
                        resultsMap[result.sku] = {
                            title: result.title,
                            sku: result.sku,
                            fpPrice: null,
                            competitors: []
                        }
                    }
                    if (result.sku_vendor.includes("FactoryPure")) {
                        resultsMap[result.sku].fpPrice = result.price
                    } else {
                        resultsMap[result.sku].competitors.push({
                            price: result.price,
                            vendor: result.sku_vendor.split(" - ")[1]
                        })
                    }
                }
                
                Object.entries(resultsMap).forEach(([key, val]) => {
                    if (val.fpPrice) {
                        val.competitors = val.competitors.filter(c => c.price < val.fpPrice)
                    }
                })
                console.log(resultsMap)
                setResults(Object.values(resultsMap))
            }
        })
    }, [])
    return (
        <>
            {results.map(r => <div style={{margin: '16px 0', padding: '16px', boxShadow: '0 0 15px rgba(0,0,0,0.25'}}>
                <p>{r.title} - {r.sku} - {r.fpPrice ? `$${r.fpPrice.toFixed(2)}` : 'NOT PRESENT'}</p>
                {r.competitors.map(c => <p style={{marginLeft: '8px'}}>{c.vendor} - {c.price ? `$${c.price.toFixed(2)}` : 'NOT PRESENT'}</p>)}
            </div>
            )}
        </>
    )
}