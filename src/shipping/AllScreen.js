import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
export default function AllScreen() {
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const [shippingMessages, setShippingMessages] = useState({})
    const [groupByMessage, setGroupByMessage] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
      if (sessionToken) {
        if (user && !user.access.includes("shipping") && !user.access.includes("*")) {
            navigate("/home")
        } else if (user) {
            fetch(`http://localhost:8080/shipping?group_by_message=${groupByMessage}&include_null_values=false`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionToken
                }
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    setShippingMessages(res.product_messages)
                }
            })
        }
      } else {
        navigate("/home")
      }
    }, [user, groupByMessage])
    const handleChangeGrouping = (group) => {
      if (groupByMessage !== group) {
        setShippingMessages({})
        setGroupByMessage(group)
      }
    }
    return (
        <>
            {user && (
                <>
                  {
                    groupByMessage ? <>
                      <button style={groupByMessage ? { background: 'rgb(0, 60, 90)', color: 'white' } : {}} onClick={() => handleChangeGrouping(true)}>Group by message</button>
                      <button style={!groupByMessage ? { background: 'rgb(0, 60, 90)', color: 'white' } : {}} onClick={() => handleChangeGrouping(false)}>Group by product</button>
                      <div class="products">
                        {Object.keys(shippingMessages).length > 0 && Object.entries(shippingMessages).map(([key, val]) => {
                          return (
                            <div style={{boxShadow: '0 0 10px rgba(0,0,0,0.25)', padding: '16px', margin: '10px'}}>
                                <p>{key}</p>
                                {val.activeOn && (<>Affected items: {val.activeOn.map(item => <p>{item.title}</p>)}</>)}
                            </div>
                          )
                        })}
                      </div>
                    </> 
                    :
                    <>
                      <button style={groupByMessage ? { background: 'rgb(0, 60, 90)', color: 'white' } : {}} onClick={() => handleChangeGrouping(true)}>Group by message</button>
                      <button style={!groupByMessage ? { background: 'rgb(0, 60, 90)', color: 'white' } : {}} onClick={() => handleChangeGrouping(false)}>Group by product</button>
                      <div class="products">
                        {Object.keys(shippingMessages).length > 0 && Object.entries(shippingMessages).map(([key, val]) => {
                          return (
                            <RenderCard message={val} />
                          )
                        })}
                      </div>
                    </>
                  }
                </>
              )
            }
        </>
    )
}

const RenderCard = ({ message }) => {
  const [currentMessage, setCurrentMessage] = useState({id: message.activeMessageId, ...message.activeMessage})
  const setMessage = (id) => {
    const cur = message.messages[id]
    setCurrentMessage({id, ...cur})
  }
  return (
    <div className="item">
      <p><span style={{fontWeight: 700}}>ITEM: </span>{message.title}</p>
      <p><span style={{fontWeight: 700}}>ACTIVE MESSAGE ID: </span>{currentMessage.id}</p>
      <p><span style={{fontWeight: 700}}>PDP LINE 1: </span>{currentMessage.pdp_line_1}</p>
      <p><span style={{fontWeight: 700}}>PDP LINE 2: </span>{currentMessage.pdp_line_2}</p>
      <p><span style={{fontWeight: 700}}>ORDER: </span>[{message.messageOrder.map((m, index) => <span onClick={() => setMessage(m)}>{m}{index !== message.messageOrder.length - 1 && ', '}</span>)}]</p>
    </div>
  )
}