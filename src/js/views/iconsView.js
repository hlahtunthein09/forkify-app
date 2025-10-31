/* import iconsUrl from "url:../../img/icons.svg";

class IconsView{
    async injectIcons()
    {
        try{
            const res  = await fetch(iconsUrl);

            if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
            }

            const svgText = await res.text();

            const div = document.createElement('div');
            div.style.display = 'none'; 
            div.setAttribute('aria-hidden', 'true');

            div.innerHTML = svgText;

            document.body.insertBefore(div, document.body.firstChild);
            console.log('✅ Icons loaded successfully');

            // Verify icons
            const iconCheck = document.getElementById('icon-clock');
            if (iconCheck) {
                console.log('✅ Icons verified - ready to use!');
            } else {
                console.warn('⚠️ Icons injected but symbols not found');
            }
        }
        catch(err)
        {
            console.error('❌ Failed to load icons:', err);
            console.error('Icon URL was:', iconsUrl);
        }
    }
}

export default new IconsView(); */