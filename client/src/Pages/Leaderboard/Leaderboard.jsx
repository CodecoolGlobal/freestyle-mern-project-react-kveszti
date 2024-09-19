import { useContext, useEffect, useState } from "react";
import { ColorThemeContext } from "../../App";

async function fetchData(url, method = "GET", body = {}) {
    try {
        const response = await fetch( url, method === "GET" ? { method, credentials: 'include' } : { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();
    } catch (err) {
        console.error("Error while fetching:", err);
    }
}
const categoryObj = [
    { id: 9, category: 'General Knowledge' },
    { id: 10, category: 'Entertainment: Books' },
    { id: 11, category: 'Entertainment: Film' },
    { id: 12, category: 'Entertainment: Music' },
    { id: 13, category: 'Entertainment: Musicals & Theatres' },
    { id: 14, category: 'Entertainment: Television' },
    { id: 15, category: 'Entertainment: Video Games' },
    { id: 16, category: 'Entertainment: Board Games' },
    { id: 17, category: 'Science & Nature' },
    { id: 18, category: 'Science: Computers' },
    { id: 19, category: 'Science: Mathematics' },
    { id: 20, category: 'Mythology' },
    { id: 21, category: 'Sports' },
    { id: 22, category: 'Geography' },
    { id: 23, category: 'History' },
    { id: 24, category: 'Politics' },
    { id: 25, category: 'Art' },
    { id: 26, category: 'Celebrities' },
    { id: 27, category: 'Animals' },
    { id: 28, category: 'Vehicles' },
    { id: 29, category: 'Entertainment: Comics' },
    { id: 30, category: 'Science: Gadgets' },
    { id: 31, category: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, category: 'Entertainment: Cartoon & Animations' }
]
function top5(statisticsObj, categoryName) {
    const result = [...statisticsObj].map(user => {
        const category = user.stats.find(category => category.category.name === categoryName);
        return { username: user.userRef.username, category };
    }).filter(entry => entry.category !== undefined);

    return result.sort((a, b) => b.category.category.points - a.category.category.points).slice(0, 5);
}

export default function Leaderboard() {
    const { colorTheme } = useContext(ColorThemeContext);
    const [allStats, setAllStats] = useState(null);


    useEffect(() => {
        fetchData(`/api/users/stats`) 
            .then(response => {
                console.log("res1: ", response);
                setAllStats(response);
                console.log("res2: ", response);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        if (allStats) {
            const stuff = top5(allStats, "total")
            console.log("stuff: ", stuff)
        }
    }, [allStats])



    return (
        <>
            {allStats ? (
                <>
                    <img className="trophyImg" src="/trophy.png"></img>
                    <div className={`leaderboardCont ${colorTheme.darkContBackground}`}>
                        <h1 className="lbTitle">Leaderboard</h1>
                        {top5(allStats, "total").map((item, index) => (
                            index < 3 ?
                                <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}>
                                    <div className="top5GlobalC1"><p className="top3"><strong>{item.username}:</strong></p></div>
                                    <div className="top5GlobalC2"></div>
                                    <div className="top5GlobalC3"><p className="top3">{item.category.category.points}</p></div>
                                </div> :
                                <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}>
                                    <div className="top5GlobalC1"><p className="top3">{item.username}:</p></div>
                                    <div className="top5GlobalC2"></div>
                                    <div className="top5GlobalC3"><p className="top3">{item.category.category.points}</p></div>
                                </div>
                        ))}
                    </div>
                    <div className="categoryCardCont">
                        {categoryObj.map(cat => (
                            <div key={cat.id} className={`leaderboardContCard ${colorTheme.darkContBackground}`}>
                                <h2 className="lbTitle">{cat.category}</h2>
                                {top5(allStats, cat.category).map((item, index) => (
                                    index < 3 ?
                                        <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}>
                                            <div className="top5GlobalC1"><p className="top3"><strong>{item.username}:</strong></p></div>
                                            <div className="top5GlobalC2"></div>
                                            <div className="top5GlobalC3"><p className="top3">{item.category.category.points}</p></div>
                                        </div> :
                                        <div key={item.category._id} className={`top5Global  ${colorTheme.darkText}`}>
                                            <div className="top5GlobalC1"><p className="top3">{item.username}:</p></div>
                                            <div className="top5GlobalC2"></div>
                                            <div className="top5GlobalC3"><p className="top3">{item.category.category.points}</p></div>
                                        </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}    