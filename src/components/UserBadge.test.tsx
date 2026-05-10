/* @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Id } from "../../convex/_generated/dataModel";
import type { PublicPublisher, PublicUser } from "../lib/publicUser";
import { TooltipProvider } from "./ui/tooltip";
import { UserBadge } from "./UserBadge";

describe("UserBadge", () => {
  const user: PublicUser = {
    _id: "user-steipete" as Id<"users">,
    _creationTime: 1,
    handle: "steipete",
    name: "Peter",
    displayName: "Peter",
    image: undefined,
    bio: undefined,
  };

  const orgPublisher: PublicPublisher = {
    _id: "publisher-openclaw" as Id<"publishers">,
    _creationTime: 1,
    kind: "org",
    handle: "openclaw",
    displayName: "OpenClaw",
    image: undefined,
    bio: undefined,
    linkedUserId: undefined,
  };

  function renderBadge(badgeUser: PublicUser | PublicPublisher) {
    return render(
      <TooltipProvider>
        <UserBadge user={badgeUser} />
      </TooltipProvider>,
    );
  }

  it("links users to canonical publisher profiles", () => {
    renderBadge(user);

    expect(screen.getByRole("link", { name: "@steipete" }).getAttribute("href")).toBe(
      "/p/steipete",
    );
  });

  it("links org publishers to canonical publisher profiles", () => {
    renderBadge(orgPublisher);

    expect(screen.getByRole("link", { name: "@openclaw" }).getAttribute("href")).toBe(
      "/p/openclaw",
    );
  });
});
