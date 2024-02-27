import { useContext, useEffect, useState } from "react";
import { ColorThemeContext } from "../../App";

async function fetchData(url, id, method = "GET", body = {}) {
    try {
        const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();
    } catch (err) {
        console.error("Error while fetching:", err);
    }
}
const categoryObj = [
    { id: 'Any', category: 'Any Category' },
    { id: 9, category: 'General Knowledge' },
    { id: 10, category: 'Entertainment: Books' },
    { id: 11, category: 'Entertainment: Film' },
    { id: 12, category: 'Entertainment: Music' },
    { id: 14, category: 'Entertainment: Television' },
    { id: 15, category: 'Entertainment: Video Games' },
    { id: 17, category: 'Science & Nature' },
    { id: 18, category: 'Science: Computers' },
    { id: 21, category: 'Sports' },
    { id: 22, category: 'Geography' },
    { id: 23, category: 'History' },
    { id: 28, category: 'Vehicles' },
    { id: 31, category: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, category: 'Entertainment: Cartoon & Animations' }
]
function top5(statisticsObj, categoryName) {
    const result = statisticsObj.map(user => {
        const category = user.stats.find(category => category.category.name === categoryName);
        return { username: user.username, category };
    }).filter(entry => entry.category !== undefined);

    return result.sort((a, b) => b.category.category.points - a.category.category.points).slice(0, 5);
}

export default function Leaderboard() {
    const { colorTheme } = useContext(ColorThemeContext);
    const [allStats, setAllSats] = useState(null);


    useEffect(() => {
        fetchData(`/api/users/stats`)
            .then(response => {
                console.log(response);
                setAllSats(response)
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        if (allStats) {
            const stuff = top5(allStats, "total")
            console.log(stuff)
        }
    }, [allStats])



    return (
        <main>
            {allStats ? <>
                <img className="trophyImg" src="/trophy.png"></img>
                <div className={`leaderboardCont ${colorTheme.darkContBackground}`}>
                    <h1 className="lbTitle">Leaderboard</h1>
                    {top5(allStats, "total").map((item, index) => index < 3 ? <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}><p><strong>{item.username}:</strong> {item.category.category.points}</p></div> : <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}><p>{item.username}: {item.category.category.points}</p></div>)}
                </div><div className="categoryButtonsCont">{categoryObj.map(cat => <button key={cat.id} className="categoryBtn">{cat.category}</button>)}</div>
            </> : <p>Loading...</p>
            }
        </main>
    )
}