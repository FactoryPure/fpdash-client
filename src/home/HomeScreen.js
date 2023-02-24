import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Layout from "../layout/Layout"
import Chart from 'chart.js/auto'

export default function HomeScreen() {
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const [salesToday, setSalesToday] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const chart = useRef(null)
    useEffect(() => {
        fetch("http://localhost:8080/analytics/sales/today", {
            headers: {
                Authorization: sessionToken
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                console.log(res.sales)
                setSalesToday(res.sales.reduce((acc, curr) => {
                    return acc + parseFloat(curr.total)
                }, 0))
                setTotalOrders(res.sales.length)
                const salesPerHour = {
                    0:0,
                    1:0,
                    2:0,
                    3:0,
                    4:0,
                    5:0,
                    6:0,
                    7:0,
                    8:0,
                    9:0,
                    10:0,
                    11:0,
                    12:0,
                    13:0,
                    14:0,
                    15:0,
                    16:0,
                    17:0,
                    18:0,
                    19:0,
                    20:0,
                    21:0,
                    22:0,
                    23:0
                }
                for (let item of res.sales) {
                    const hour = new Date(item.created_at).getHours()
                    salesPerHour[hour] += parseFloat(item.total)
                }
                new Chart(chart.current, {
                    type: 'bar',
                    data: {
                      labels: Object.keys(salesPerHour),
                      datasets: [{
                        data: Object.values(salesPerHour),
                        borderWidth: 0,
                        backgroundColor: Object.values(salesPerHour).map(v => `rgba(${Math.max(173, 50 + (v / 1000) * 5)}, ${216 - (v / 1000) * 7}, ${Math.max(230, 50 + (v / 1000) * 10)}, 0.75)`)
                      }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Moneys",
                                    font: {
                                        size: 15
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: "Hour",
                                    font: {
                                        size: 15
                                    }
                                }
                            }
                        }
                    }
                  });
            }
        })
    }, [])
    return (
        <>
            {user && <>
                    <h1>Welcome, {user.firstName}</h1>
                    <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '20px'}}>Today's Orders</p>
                    <p style={{textAlign: 'center'}}>${salesToday.toFixed(2)} - {totalOrders} Orders</p>
                    <canvas style={{ maxHeight: '300px' }} ref={chart}></canvas>
            </>}
        </>
    )
}