import { lazy, Suspense } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/not-found";

// the 3D world pulls in Three.js, so it loads only when visited
const World = lazy(() => import("@/pages/World"));
const WorldRoute = () => (
  <Suspense fallback={<div className="world-root" />}>
    <World />
  </Suspense>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/world" component={WorldRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
