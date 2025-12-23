export default function Navbar({ actions })
{
  return (
    <nav>
      <ul>
        <li onClick={() => actions?.goToStart()}>Explore</li>
        <li onClick={() => actions?.goToPortal04()}>Demo</li>
        <li data-short="About" onClick={() => actions?.goToPortal03()}>More about me</li>
      </ul>
    </nav>
  )
}
