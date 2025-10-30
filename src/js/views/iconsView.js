import iconsUrl from "url:../../img/icons.svg";

class IconsView{
    async injectIcons()
    {
        try{
            const res  = await fetch(iconsUrl);
            const svgText = await res.text();

            const div = document.createElement('div');
            div.style.display = 'none'; 
            div.setAttribute('aria-hidden', 'true');

            div.innerHTML = svgText;

            document.body.insertBefore(div, document.body.firstChild);
            console.log('✅ Icons loaded successfully');
        }
        catch(err)
        {
            console.error('❌ Failed to load icons:', err);
        }
    }
}

export default new IconsView();