<script>
    export let page = 1;
</script>

<div>
    {page}
</div>

<style lang="scss">
    div{
        $size:85px;
        background-color: darken($AccentColor,20%);
        position: fixed;
        right: 0;
        top:50%;
        font-size: $PageNumberFontSize;
        color:$FontColor;
        width: $size;
        height: $size;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100% 20% 20% 100%;
        z-index: 1;
    }

    @media only screen and (max-width: $MobileWidth){
        div{
            $size: 60px;
            font-size: $PageNumberFontSizeMobile;
            width: $size;
            height: $size;
        }
    }
</style>