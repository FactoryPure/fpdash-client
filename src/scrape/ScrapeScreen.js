import { useEffect, useState } from "react"
import "./ScrapeScreen.css"

export default function ScrapeScreen() {
    const [results, setResults] = useState([])
    useEffect(() => {
        fetch("https://api.fpdash.com/scrape/skus/results").then(res => res.json()).then(res => {
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
                const sortedResult = Object.entries(resultsMap).sort((a, b) => {
                    return a[1].competitors.length > b[1].competitors.length ? -1 : 1
                })
                console.log(sortedResult)
                setResults(sortedResult.map(r => r[1]))
            }
        })
    }, [])
    return (
        <>
            {
            results.map(r => (
                    <div className="scrape__card">
                        <p className="scrape__card__sku">{r.sku}</p>
                        <p className="scrape__card__title">{r.title}</p>
                        <p className="scrape__card__price">FP Price: {r.fpPrice ? `$${r.fpPrice.toFixed(2)}` : 'NOT PRESENT'}</p>
                        {r.competitors.map(c => <p className="scrape__card__competitor">{c.vendor} - {c.price ? `$${c.price.toFixed(2)}` : 'NOT PRESENT'}</p>)}
                    </div>
                )
            )}
        </>
    )
}