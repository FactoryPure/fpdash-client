import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Layout from "../layout/Layout"
import Chart from 'chart.js/auto'

export default function HomeScreen() {
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const [salesToday, setSalesToday] = useState([])
    const chart = useRef(null)
    useEffect(() => {
        fetch("https://api.fpdash.com/analytics/sales/today", {
            headers: {
                Authorization: sessionToken
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
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
                        label: 'Sales per hour',
                        data: Object.values(salesPerHour),
                        borderWidth: 1
                      }]
                    },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: true
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
                    <canvas ref={chart}></canvas>
            </>}
        </>
    )
}