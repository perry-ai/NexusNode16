<template>
  <img 
    class="NuxtLogo"
    src="~/assets/NexusNode16.png" 
    alt="NexusNode Logo"
    style="max-width: 500px; max-height: 500px"
  />
</template>

<style>
.NuxtLogo {
  animation: 1s appear;
  margin: auto;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
