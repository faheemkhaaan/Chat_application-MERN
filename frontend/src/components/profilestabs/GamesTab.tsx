function GamesTab() {
    const games = ['Valorant', 'Among Us', 'Minecraft'];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">🎮 Games</h2>
            <ul className="space-y-2">
                {games.map((game, idx) => (
                    <li key={idx} className="bg-white p-3 shadow rounded-md">{game}</li>
                ))}
            </ul>
        </div>
    );
}
export default GamesTab