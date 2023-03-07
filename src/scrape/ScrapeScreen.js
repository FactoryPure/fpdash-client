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
                            sku_vendor: result.sku_vendor,
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
                setResults(sortedResult.map(r => r[1]))
            }
        })
    }, [])
    const LinkOut = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#4a4a4a" width="24px" height="24px" viewBox="0 0 32 32"><path d="M23.5 23.5h-15v-15h4.791V6H6v20h20v-7.969h-2.5z"/><path d="M17.979 6l3.016 3.018-6.829 6.829 1.988 1.987 6.83-6.828L26 14.02V6z"/></svg>
        )
    }
    return (
        <>
            {
            results.map(r => (
                    <div className="scrape__card">
                        <a className="scrape__link" href={`https://www.google.com/search?q=${r.sku_vendor && r.sku_vendor.split(" - ")[0].split(" ").join("+")}&tbm=shop&tbs=new:1&gl=us`} target="_blank">
                            <p className="scrape__card__sku">{r.sku}</p>
                            <LinkOut />
                        </a>
                        <p className="scrape__card__title">{r.title}</p>
                        <p className="scrape__card__price">FP Price: {r.fpPrice ? `$${r.fpPrice.toFixed(2)}` : 'NOT PRESENT'}</p>
                        {r.competitors.map(c => <p className="scrape__card__competitor">{c.vendor} - {c.price ? `$${c.price.toFixed(2)}` : 'NOT PRESENT'}</p>)}
                    </div>
                )
            )}
        </>
    )
}