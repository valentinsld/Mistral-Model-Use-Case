<template>
  <header class="header">
    <div class="header__background" />

    <div class="header__container">
      <div class="header__left">
        <a class="header__logo" href="/" rel="home" aria-label="Home">
          <img class="logo__image" src="/assets/images/mistral-ai-logo.svg" alt="Mistral AI Logo" width="100"
            height="100" />
        </a>

        <nav class="header__nav" aria-label="Main navigation">
          <ul class="nav__list">
            <li class="list__item is-dropdown">
              <button class="item__link" role="menuitem" aria-haspopup="menu" aria-expanded="false">
                Produits
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />
                  </span>
                </span>
              </button>
            </li>

            <li class="list__item">
              <a class="item__link" href="/solutions" role="menuitem">
                Solutions
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />
                  </span>
                </span>
              </a>
            </li>

            <li class="list__item">
              <a class="item__link" href="/models" role="menuitem">
                Recherche
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />

                  </span>
                </span>
              </a>
            </li>

            <li class="list__item">
              <a class="item__link" href="/news" role="menuitem">
                Blog
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />
                  </span>
                </span>
              </a>
            </li>

            <li class="list__item">
              <a class="item__link" href="/customers" role="menuitem">
                Clients
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />
                  </span>
                </span>
              </a>
            </li>

            <li class="list__item is-dropdown">
              <button class="item__link" role="menuitem" aria-haspopup="menu" aria-expanded="false">
                Entreprise
                <span class="link__icon">
                  <span class="icon__arrows">
                    <IconsArrowDown class="arrows__svg is-down" />
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Right: Actions -->
      <div class="header__right">
        <a class="header__contact" href="/contact" target="_self">
          Contact commercial
          <svg class="contact__icon" width="24" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 7.86859L8.5 5.30859L5.94 5.30859L5.94 7.86859L8.5 7.86859Z" fill="currentColor" />
            <path d="M5.9375 5.29828L5.9375 2.73828L3.3775 2.73828L3.3775 5.29828L5.9375 5.29828Z"
              fill="currentColor" />
            <path d="M3.37891 2.73969L3.37891 0.179688L0.818907 0.179687L0.818907 2.73969L3.37891 2.73969Z"
              fill="currentColor" />
            <path d="M5.9375 10.4311L5.9375 7.87109L3.3775 7.87109L3.3775 10.4311L5.9375 10.4311Z"
              fill="currentColor" />
            <path d="M3.37891 12.9975L3.37891 10.4375L0.818907 10.4375L0.818907 12.9975L3.37891 12.9975Z"
              fill="currentColor" />
          </svg>
        </a>

        <div class="header__studio">
          <a class="studio__link" href="https://console.mistral.ai?utm_source=website&utm_medium=header_cta"
            target="_blank" rel="noopener">
            Essayer Studio
          </a>
          <button class="studio__dropdown" aria-haspopup="menu" aria-expanded="false">
            <span class="dropdown__icon">
              <span class="icon__arrows">
                <svg class="arrows__svg is-down" width="24" viewBox="0 0 9 13" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 7.86859L8.5 5.30859L5.94 5.30859L5.94 7.86859L8.5 7.86859Z" fill="currentColor" />
                  <path d="M5.9375 5.29828L5.9375 2.73828L3.3775 2.73828L3.3775 5.29828L5.9375 5.29828Z"
                    fill="currentColor" />
                  <path d="M3.37891 2.73969L3.37891 0.179688L0.818907 0.179687L0.818907 2.73969L3.37891 2.73969Z"
                    fill="currentColor" />
                  <path d="M5.9375 10.4311L5.9375 7.87109L3.3775 7.87109L3.3775 10.4311L5.9375 10.4311Z"
                    fill="currentColor" />
                  <path d="M3.37891 12.9975L3.37891 10.4375L0.818907 10.4375L0.818907 12.9975L3.37891 12.9975Z"
                    fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        </div>

        <button class="header__burger" aria-label="Open menu">
          <svg width="24" viewBox="0 0 75 63" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M49.76 49.7598H0V62.1998H49.76V49.7598Z" fill="currentColor" />
            <path opacity="0.7" d="M74.64 24.8799H0V37.3199H74.64V24.8799Z" fill="currentColor" />
            <path d="M74.64 0H0V12.44H74.64V0Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss" src="./Header.scss" />
